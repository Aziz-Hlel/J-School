import { apiErrorResponseSchema, type ApiErrorResponse, type ApiResponse } from '@/types/api/ApiResponse';
import toastWrapper from '@/utils/toastWrapper';
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import ENV from '../config/env.variables';
import { ApiError } from './ApiError';
import { jwtTokenManager } from './token/JwtTokenManager.class';

const createAxiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: ENV.BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

type CustomAxiosRequestOptions = AxiosRequestConfig & {
  params?: Record<string, unknown> | URLSearchParams;
};
class ApiService {
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
  }> = [];

  constructor() {
    this.api = createAxiosInstance();
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      async (config) => {
        const token = await jwtTokenManager.getAccessToken();
        if (token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;
        const originalRequest = error?.config;

        // No config = non-retrievable error
        if (!originalRequest) return Promise.reject(error);

        // -------------------------------
        // 401 Handling
        // -------------------------------
        if (status === 401) {
          // Already retried once → hard fail
          if (originalRequest.__retry) {
            jwtTokenManager.clearTokens();
            window.location.href = '/signin';
            return Promise.reject(error);
          }

          // If refresh already happening → enqueue
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                resolve: (token: string) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  resolve(this.api(originalRequest));
                },
                reject,
              });
            });
          }

          // Begin token refresh sequence
          originalRequest.__retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshAccessToken();
            this.processQueue(null, newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            jwtTokenManager.clearTokens();
            window.location.href = '/signin';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Non-401 errors
        return Promise.reject(error);
      },
    );
  }

  // Process failed request queue
  private processQueue(error: unknown, token: string | null = null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token!);
      }
    });

    this.failedQueue = [];
  }

  private displayDevAlert = (statusCode: number, error: string) => {
    toastWrapper.dev.error(`Request failed with status ${statusCode}`, {
      description: `${error}`,
    });
  };

  // Refresh access token
  private async refreshAccessToken(): Promise<string> {
    const newAccessToken = await jwtTokenManager.refreshAccessToken();
    if (!newAccessToken) {
      throw new Error('Failed to refresh access token');
    }
    return newAccessToken;
  }

  validateApiErrorSchema(response: ApiErrorResponse): response is ApiErrorResponse {
    const parsed = apiErrorResponseSchema.safeParse(response);
    if (parsed.success) {
      return true;
    }
    toastWrapper.dev.Critical('Response is not of type ApiErrorResponse');
    return false;
  }

  isAxiosError(error: unknown): error is AxiosError {
    return axios.isAxiosError(error);
  }

  handleApiErrorResponse(error: unknown): ApiError {
    if (typeof error !== 'object' && error === null) {
      toastWrapper.dev.Critical('Unknown error, error is not an object or is null');
      const apiError: ApiError = new ApiError({
        message: 'Unknown error occurred',
        status: 0,
        timestamp: new Date(),
        path: '',
        isBackendError: false,
      });
      return apiError;
    }

    const isAxiosError = axios.isAxiosError(error);

    if (isAxiosError && error.response) {
      this.validateApiErrorSchema(error.response.data);
      const apiError: ApiError = new ApiError({
        message: error.response.data.message || 'API Error',
        status: error.response.status,
        details: error.response.data.details,
        timestamp: new Date(),
        isBackendError: true,
        path: error.response.data.path || '',
      });
      return apiError;
    } else if (isAxiosError && error.request) {
      // ⚠️ No response received — network error or timeout
      this.displayDevAlert(NaN, 'No response received from server — network error or timeout');
      const apiError: ApiError = new ApiError({
        message: 'No response received from server',
        status: 0,
        timestamp: new Date(),
        isBackendError: false,
        details: undefined,
        path: '',
      });
      return apiError;
    }

    // ⚠️ Something else went wrong setting up the request
    toastWrapper.dev.Critical('Something else went wrong setting up the request');
    return new ApiError({
      message: 'Request setup error',
      timestamp: new Date(),
      path: '',
      status: 0,
      isBackendError: false,
    });
  }

  private toApiSuccessResponse<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data,
    };
  }

  // Wrapper methods with error handling
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.get<T>(url, config);

      return this.toApiSuccessResponse(response.data);
    } catch (error: ApiErrorResponse | unknown) {
      return this.handleApiErrorResponse(error);
    }
  }

  async getThrowable<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.get<T>(url, config);

      return response.data;
    } catch (error: ApiErrorResponse | unknown) {
      const errorResponse = this.handleApiErrorResponse(error);
      throw errorResponse;
    }
  }

  async post<T>(url: string, data: unknown, config?: CustomAxiosRequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post<T>(url, data, config);

      return this.toApiSuccessResponse(response.data);
    } catch (error: ApiErrorResponse | unknown) {
      const errorResponse = this.handleApiErrorResponse(error);
      return errorResponse;
    }
  }

  async postThrowable<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.post<T>(url, data, config);

      return response.data;
    } catch (error: ApiErrorResponse | unknown) {
      const errorResponse = this.handleApiErrorResponse(error);
      throw errorResponse;
    }
  }

  async put<T>(url: string, data: unknown, config?: CustomAxiosRequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.put<T>(url, data, config);

      return this.toApiSuccessResponse(response.data);
    } catch (error: ApiErrorResponse | unknown) {
      const errorResponse = this.handleApiErrorResponse(error);
      return errorResponse;
    }
  }

  async putThrowable<T>(url: string, data: unknown, config?: CustomAxiosRequestOptions): Promise<T> {
    try {
      const response = await this.api.put<T>(url, data, config);

      return response.data;
    } catch (error: ApiErrorResponse | unknown) {
      const errorResponse = this.handleApiErrorResponse(error);
      throw errorResponse;
    }
  }

  async delete<T>(url: string, config?: CustomAxiosRequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.delete<T>(url, config);

      return this.toApiSuccessResponse(response.data);
    } catch (error: ApiErrorResponse | unknown) {
      const errorResponse = this.handleApiErrorResponse(error);
      return errorResponse;
    }
  }

  async deleteThrowable<T>(url: string, config?: CustomAxiosRequestOptions): Promise<T> {
    try {
      const response = await this.api.delete<T>(url, config);

      return response.data;
    } catch (error: ApiErrorResponse | unknown) {
      const errorResponse = this.handleApiErrorResponse(error);
      throw errorResponse;
    }
  }
}

export const apiService = new ApiService();
