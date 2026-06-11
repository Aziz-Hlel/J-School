import z from 'zod';
import { globalTimetableItemSchema } from '../shared/timetable.schema';

export const createTimetableRequestSchema = z.object({
  day: globalTimetableItemSchema.day,
  startTime: globalTimetableItemSchema.startTime,
  endTime: globalTimetableItemSchema.endTime,
  room: globalTimetableItemSchema.room,
});

export type CreateTimetableRequest = z.infer<typeof createTimetableRequestSchema>;
