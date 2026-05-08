import z from 'zod';

export const createAnnouncmentReq = z.object({
  description: z.string().max(500, 'Description must be less than 500 characters'),
  media: z
    .array(
      z.object({
        id: z.uuid(),
        order: z.number().int().min(0).max(50),
      }),
    )
    .max(20, 'You can upload a maximum of 20 media files')
    .nullish(),
});

export type CreateAnnouncementReq = z.infer<typeof createAnnouncmentReq>;
