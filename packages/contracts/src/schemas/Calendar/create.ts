import z from 'zod';
import { globalCalendarSchema } from '../shared/calendar.schema';

export const createCalendarReqSchema = z.object({
  title: globalCalendarSchema.title,
  description: globalCalendarSchema.description,
  type: globalCalendarSchema.type,
  startDate: globalCalendarSchema.startDate,
  startTime: globalCalendarSchema.startTime,
  endDate: globalCalendarSchema.endDate,
  endTime: globalCalendarSchema.endTime,
  sendNotification: z.boolean().default(false).catch(false),
});

export type CreateCalendarReq = z.infer<typeof createCalendarReqSchema>;
