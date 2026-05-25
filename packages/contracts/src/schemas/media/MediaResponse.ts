import z from 'zod';
import { MediaType } from '../../types/enums/enums';

export const mediaResponseSchema = z.object({
  id: z.uuid(),
  url: z.url(),
  key: z.string(),
  blurHash: z.string().nullable(),
  type: z.enum(MediaType),
});

export type MediaResponse = z.infer<typeof mediaResponseSchema>;
