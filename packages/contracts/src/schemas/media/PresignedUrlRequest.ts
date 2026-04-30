import z from 'zod';

const oneMb = 1024 * 1024;
const maxFileSize = 100 * oneMb;

export const presignedUrlRequestSchema = z.object({
  name: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1),
  fileSize: z.number().positive().max(maxFileSize),
  fileType: z.enum(['webp', 'jpg', 'jpeg', 'png', 'mp4', 'mov', 'avi', 'gif']),
});

export type PresignedUrlRequest = z.infer<typeof presignedUrlRequestSchema>;
