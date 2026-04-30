import z from 'zod';

export const mediaResponseSchema = z.object({
  id: z.uuid(),
  url: z.url(),
  key: z.string(),
});

export type MediaResponse = z.infer<typeof mediaResponseSchema>;
