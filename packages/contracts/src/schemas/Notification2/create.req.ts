import z from 'zod';
import { NotificationType } from '../../types/enums/enums';

const notificationTypes = z.discriminatedUnion('type', [
  z.object({ type: z.literal(NotificationType.GLOBAL) }),
  z.object({ type: z.literal(NotificationType.GROUP), userIds: z.array(z.uuid()) }),
]);

export const createNotification2ReqSchema = z.object({
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
});

export type CreateNotification2Req = z.infer<typeof createNotification2ReqSchema>;
