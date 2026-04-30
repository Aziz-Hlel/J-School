import z from 'zod';
import { isValidDate } from '../../../utils/isValidDate';
import isDateInFuture from '../../../utils/isDateInFuture';

// ! Add IMMEDIATE type
export const notificationScheduleSchema = z.discriminatedUnion('scheduleType', [
  z.object({
    scheduleType: z.literal('DELAYED'),
    delaySeconds: z.number().int().positive(),
  }),
  z.object({
    scheduleType: z.literal('SCHEDULED'),
    scheduledAt: z
      .string()
      .refine(isValidDate, 'Invalid date')
      .refine((date) => isDateInFuture(new Date(date)), 'Scheduled date must be in the future'),
  }),
]);

export type NotificationSchedule = z.infer<typeof notificationScheduleSchema>;

export type NotificationScheduleResponse =
  | {
      scheduleType: 'DELAYED';
      delaySeconds: number;
    }
  | {
      scheduleType: 'SCHEDULED';
      scheduledAt: string;
    };
