import z from 'zod';

export const announcementQueryParamSchema = z.object({
  cursor: z.uuid().nullish().catch(null),
  limit: z.coerce.number().int().positive().max(100).catch(10),
});

export type AnnouncementQueryParamInput = z.infer<typeof announcementQueryParamSchema>;
