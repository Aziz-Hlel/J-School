export class ApiError extends Error {
  readonly success = false;
  readonly message: string;
  readonly status: number;
  readonly details: Record<string, string> | undefined;
  readonly timestamp: Date;
  readonly path: string;
  readonly isBackendError: boolean;

  constructor({
    message,
    status,
    details,
    isBackendError,
    timestamp,
    path,
  }: {
    message: string;
    status: number;
    details?: Record<string, string>;
    isBackendError: boolean;
    timestamp?: Date;
    path: string;
  }) {
    super(message);
    this.name = 'ApiError';
    this.message = message;
    this.status = status;
    this.details = details;
    this.timestamp = timestamp || new Date();
    this.path = path;
    this.isBackendError = isBackendError;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
