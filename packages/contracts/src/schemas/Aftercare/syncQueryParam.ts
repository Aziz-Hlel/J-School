import { z } from 'zod';

export const syncAftercareQueryParamSchema = z.object({
  date: z.iso.date(),
});

export type SyncAftercareQueryParam = z.infer<typeof syncAftercareQueryParamSchema>;
