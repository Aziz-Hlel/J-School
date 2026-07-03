import type { ApiResponse } from '@/types/api/ApiResponse';
import type { FirebaseSignInRequestDto } from '@/types/auth/SignInRequestDto';
import type { SignInResponseDto } from '@/types/auth/SignInResponseDto';
import type { FirebaseSignUpRequestSchema } from '@/types/auth/SignUpRequestDto';
import type { SignUpResponseDto } from '@/types/auth/SignUpResponseDto';
import type { AuthResponse } from '@repo/contracts/schemas/auth/authResponse';
import { apiService } from '../apiService';
import { apiRoutes } from '../routes';

export interface IauthService {
  signIn: (payload: FirebaseSignInRequestDto) => Promise<ApiResponse<SignInResponseDto>>;

  signUp: (payload: FirebaseSignUpRequestSchema) => Promise<ApiResponse<SignUpResponseDto>>;

  oAuthSignIn: (payload: FirebaseSignInRequestDto) => Promise<ApiResponse<SignInResponseDto>>;

  me: () => Promise<ApiResponse<{ data: AuthResponse }>>;
}

export const authService: IauthService = {
  signIn: (payload) => {
    return apiService.post<SignInResponseDto>(apiRoutes.auth.signIn(), payload);
  },
  signUp: (payload) => {
    return apiService.post<SignUpResponseDto>(apiRoutes.auth.signUp(), payload);
  },
  oAuthSignIn: (payload) => {
    return apiService.post<SignInResponseDto>(apiRoutes.auth.oAuthSignIn(), payload);
  },
  me: () => {
    return apiService.get(apiRoutes.auth.me());
  },
};
