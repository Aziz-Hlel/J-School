import z from 'zod';

export const createFeedReq = z.object({
  title: z.string().nonempty({ message: 'Title is required' }).max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .nonempty({ message: 'Description is required' })
    .max(500, 'Description must be less than 500 characters'),
  media: z
    .array(
      z.object({
        id: z.uuid(),
        order: z.number().int().min(0).max(50),
      }),
    )
    .max(20, 'You can upload a maximum of 20 media files')
    .nullable(),
});

export type CreateFeedReq = z.infer<typeof createFeedReq>;
