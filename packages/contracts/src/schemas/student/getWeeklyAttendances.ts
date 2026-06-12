import z from 'zod';
import { toWeekNbr } from '../utils/getWeekNbr';

export const studentWeeklyAttendanceQueryParamSchema = z.object({
  week: z.coerce.number().int().positive().max(52).default(toWeekNbr()),
});

export type StudentWeeklyAttendancesQueryParam = z.infer<typeof studentWeeklyAttendanceQueryParamSchema>;
