import z from 'zod';

export const cursorQueryParamsSchema = z.object({
  cursor: z.uuid().optional().catch(undefined),
  limit: z.coerce.number().int().positive().max(100).catch(10),
});

export type CursorQueryParams = z.infer<typeof cursorQueryParamsSchema>;
