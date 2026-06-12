import z from 'zod';
import { AttendanceStatus } from '../../types/enums/enums';

export const globalAttendanceSchema = {
  status: z.enum(AttendanceStatus).nullable(),
  week: z.number().int().positive().max(52),
  note: z.string().max(255).nullable(),
};
