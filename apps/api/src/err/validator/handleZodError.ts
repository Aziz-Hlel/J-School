import { ZodError } from 'zod';
import { ApiError } from '../apiError.type';
import ENV from '../../config/env';
import { prettifyError } from 'zod';
import { Request } from 'express';

export const handleZodError = (error: ZodError<unknown>, req: Request) => {
  const formatted: Record<string, string> = {};

  for (const issue of error.issues) {
    const path = issue.path.join('.');
    formatted[path] = issue.message;
  }
  // prettifyError(error);

  const apiResponse: ApiError = {
    success: false,
    message: 'Validation failed',
    details: { 'Zod Error': prettifyError(error) },
    timestamp: new Date(),
    path: req.originalUrl,
  };
  ENV.NODE_ENV !== 'production' && error.stack && (apiResponse.stack = error.stack);
  return apiResponse;
};
