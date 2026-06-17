import z from 'zod';
import { presignedUrlRequestSchema } from './PresignedUrlRequest';

export const presignedUrlRequestListSchema = z.object({
  files: z.array(presignedUrlRequestSchema).min(1),
});

export type PresignedUrlRequest = z.infer<typeof presignedUrlRequestSchema>;
export type PresignedUrlRequestList = z.infer<typeof presignedUrlRequestListSchema>;
