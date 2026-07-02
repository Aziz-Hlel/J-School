import { UserRole } from '@repo/db/prisma/enums';
import { z } from 'zod';

export const notificationCountCursorSchema = z.object({
  role: z.enum(UserRole),
  studentId: z.uuid().optional(),
});

export type NotificationCountCursorSchema = z.infer<typeof notificationCountCursorSchema>;
