import z from 'zod';
import { globalTimetableItemSchema } from '../../shared/timetable.schema';

export const createClassroomTimetableRequestSchema = z.object({
  subjectId: z.uuid(),
  day: globalTimetableItemSchema.day,
  startTime: globalTimetableItemSchema.startTime,
  endTime: globalTimetableItemSchema.endTime,
});

export type CreateClassroomTimetableRequest = z.infer<typeof createClassroomTimetableRequestSchema>;
