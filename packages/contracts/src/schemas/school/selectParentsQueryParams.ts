import z from 'zod';

export const selectParentsQueryParamsSchema = z.object({
  search: z.string().optional().catch(undefined),
  cursor: z.uuid().optional().catch(undefined),
  limit: z.coerce.number().optional().default(10).catch(10),
});

export type SelectParentsQueryParams = z.infer<typeof selectParentsQueryParamsSchema>;
