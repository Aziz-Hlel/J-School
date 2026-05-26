import z from 'zod';
import { globalCalendarSchema } from '../shared/calendar.schema';

export const updateCalendarReqSchema = z.object({
  title: globalCalendarSchema.title,
  description: globalCalendarSchema.description,
  type: globalCalendarSchema.type,
  startDate: globalCalendarSchema.startDate,
  startTime: globalCalendarSchema.startTime,
  endDate: globalCalendarSchema.endDate,
  endTime: globalCalendarSchema.endTime,
});

export type UpdateCalendarReq = z.infer<typeof updateCalendarReqSchema>;
