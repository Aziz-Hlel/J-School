import { NotificationSourceType } from '@repo/db/prisma/enums';
import z from 'zod';
import { NotificationType } from '../../types/enums/enums';

const notificationTypes = z.discriminatedUnion('type', [
  z.object({ type: z.literal(NotificationType.GLOBAL) }),
  z.object({ type: z.literal(NotificationType.GROUP), accountIds: z.array(z.uuid()) }),
]);

export const createNotificationInternalSchema = z.object({
  title: z.object({
    en: z.string(),
    fr: z.string().optional(),
    ar: z.string().optional(),
  }),
  content: z.object({
    en: z.string(),
    fr: z.string().optional(),
    ar: z.string().optional(),
  }),
  type: notificationTypes,
  sourceId: z.uuid().nullable(),
  schoolId: z.uuid(),
  sourceType: z.enum(NotificationSourceType),
});

export type CreateNotificationInternal = z.infer<typeof createNotificationInternalSchema>;
