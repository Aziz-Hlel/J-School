import { z } from 'zod';
import { DayOfWeek } from '../../types/enums/enums';

export const getTeacherTimetableQuery = z.object({
  day: z.enum(DayOfWeek).optional().catch(undefined),
});

export type GetTeacherTimetableQuery = z.infer<typeof getTeacherTimetableQuery>;
