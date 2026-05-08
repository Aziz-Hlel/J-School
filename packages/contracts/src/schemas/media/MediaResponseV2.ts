import z from 'zod';
import { MediaType } from '../../types/enums/enums';

export const mediaResponseSchemaV2 = z.object({
  id: z.uuid(),
  url: z.url(),
  order: z.number().int().min(0).max(50).nullable(),
  type: z.enum(MediaType),
});

export type MediaResponseV2 = z.infer<typeof mediaResponseSchemaV2>;
