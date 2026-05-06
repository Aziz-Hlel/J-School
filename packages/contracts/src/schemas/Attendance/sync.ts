import z from 'zod';
import { globalAttendanceSchema } from '../shared/attendance.schema';

export const attendanceSyncDto = z.object({
  week: globalAttendanceSchema.week,
  timetableId: z.uuid('Invalid timetable ID'),
  students: z
    .array(
      z.object({
        studentId: z.uuid('Invalid student ID'),
        status: globalAttendanceSchema.status,
      }),
    )
    .nonempty('Students array cannot be empty'),
});

export type AttendanceSyncInput = z.infer<typeof attendanceSyncDto>;
