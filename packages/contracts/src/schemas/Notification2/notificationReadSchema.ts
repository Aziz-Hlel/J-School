import { NotificationSourceType, UserRole } from '@repo/db/prisma/browser';
import { z } from 'zod';

export const notificationMarkAsReadSchema = z.object({
  type: z.enum(NotificationSourceType),
  role: z.enum(UserRole),
  studentId: z.uuid().optional(),
});

export type NotificationMarkAsReadSchema = z.infer<typeof notificationMarkAsReadSchema>;
