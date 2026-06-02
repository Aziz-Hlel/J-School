import type { ApiError } from '@/Api/ApiError';
import z from 'zod';

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  status: z.number(),
  details: z.record(z.string(), z.string()).optional(),
  timestamp: z.coerce.date(),
  path: z.string(),
});

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiError;
