import z from 'zod';
import { DayOfWeek } from '../../types/enums/enums';

export const globalTimetableItemSchema = {
  day: z.enum(DayOfWeek),
  startTime: z.iso.time(),
  endTime: z.iso.time(),
  room: z
    .string()
    .trim()
    .max(50)
    .transform((val) => (val.length === 0 ? null : val))
    .nullable(),
};
