import z from 'zod';
import { DayOfWeek } from '../../types/enums/enums';
import { toWeekNbr } from '../utils/getWeekNbr';

export const studentWeeklyAttendanceQueryParamSchema = z.object({
  week: z.coerce.number().int().positive().max(52).default(toWeekNbr()),
  day: z.enum(DayOfWeek).nullish().catch(undefined),
});

export type StudentWeeklyAttendancesQueryParam = z.infer<typeof studentWeeklyAttendanceQueryParamSchema>;
