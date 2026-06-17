import dayjs from 'dayjs';
import z from 'zod';

export const calendarQueryParamsSchema = z.object({
  startDate: z
    .string()
    .transform((d) => new Date(d))
    .catch(() => dayjs(new Date()).startOf('month').toDate()),
  endDate: z
    .string()
    .transform((d) => new Date(d))
    .catch(() => dayjs(new Date()).endOf('month').toDate()),
});

export type CalendarQueryParams = z.infer<typeof calendarQueryParamsSchema>;
