import { z } from 'zod';

export const updatePostReqSchema = z
  .object({
    content: z.string().max(1000, 'Post must be less than 1000 characters').nullish(),
    mediaIds: z.array(z.uuid()).max(10, 'You can only upload 10 files at a time').nullish(),
  })
  .refine((data) => data.content || data.mediaIds, {
    message: 'Post must have content or media files',
    path: ['content', 'mediaIds'],
  });
export type UpdatePostReq = z.infer<typeof updatePostReqSchema>;
