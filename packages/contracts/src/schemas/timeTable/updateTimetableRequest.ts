import z from 'zod';
import { globalTimetableItemSchema } from '../shared/timetable.schema';

export const updateTimetableRequestSchema = z.object({
  day: globalTimetableItemSchema.day,
  startTime: globalTimetableItemSchema.startTime,
  endTime: globalTimetableItemSchema.endTime,
});

export type updateTimetableRequest = z.infer<typeof updateTimetableRequestSchema>;
