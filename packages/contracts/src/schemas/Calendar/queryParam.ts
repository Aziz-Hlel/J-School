import z from 'zod';

export const calendarQueryParamsSchema = z.object({
  week: z.coerce.number().int().positive().nullish(),
  limit: z.number().int().positive().max(100).catch(10),
});

export type CalendarQueryParams = z.infer<typeof calendarQueryParamsSchema>;
