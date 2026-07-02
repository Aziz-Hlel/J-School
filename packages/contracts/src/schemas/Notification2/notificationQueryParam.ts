import { UserRole } from '@repo/db/prisma/enums';
import { z } from 'zod';
import { cursorQueryParamsSchema } from '../cursor/cursorQueryParams';

export const notificationCursorSchema = cursorQueryParamsSchema.extend({
  role: z.enum(UserRole),
  studentId: z.uuid().optional(),
});

export type NotificationCursorSchema = z.infer<typeof notificationCursorSchema>;
