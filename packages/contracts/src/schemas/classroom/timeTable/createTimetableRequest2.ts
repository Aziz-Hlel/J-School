import z from 'zod';
import { globalTimetableItemSchema } from '../../shared/timetable.schema';

export const createClassroomTimetableReqSchema = z.object({
  subjectId: z.uuid(),
  day: globalTimetableItemSchema.day,
  startTime: globalTimetableItemSchema.startTime,
  endTime: globalTimetableItemSchema.endTime,
  room: globalTimetableItemSchema.room,
});

export type CreateClassroomTimetableReq = z.infer<typeof createClassroomTimetableReqSchema>;
