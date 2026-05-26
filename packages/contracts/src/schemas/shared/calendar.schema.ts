import { CalendarSessionType } from '@repo/db/prisma/enums';
import z from 'zod';

export const globalCalendarSchema = {
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters long')
    .max(255, 'Title must be at most 255 characters long'),
  description: z
    .string()
    .trim()
    .min(3, 'Description must be at least 3 characters long')
    .max(255, 'Description must be at most 255 characters long')
    .nullable(),
  type: z.enum(CalendarSessionType),
  startDate: z.iso.date(),
  startTime: z.iso.time().nullable(),
  endDate: z.iso.date(),
  endTime: z.iso.time().nullable(),
};
