import z from 'zod';
import { DayOfWeek } from '../../types/enums/enums';

export const globalTimetableItemSchema = {
  day: z.enum(DayOfWeek),
  startTime: z.iso.time(),
  endTime: z.iso.time(),
};
