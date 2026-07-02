import { NotificationClientResponse } from '@repo/contracts/schemas/Notification2/response';
import { NotificationGetPayload } from '@repo/db/prisma/models';

export class NotificationMapper {
  static toResponse(
    notification: NotificationGetPayload<{ include: { title: true; content: true } }>,
  ): NotificationClientResponse {
    return {
      id: notification.id,
      title: {
        en: notification.title?.en || '',
        fr: notification.title?.fr || '',
        ar: notification.title?.ar || '',
      },
      content: {
        en: notification.content?.en || '',
        fr: notification.content?.fr || '',
        ar: notification.content?.ar || '',
      },
      type: notification.type,
      sourceType: notification.sourceType,
      sourceId: notification.sourceId,
      createdAt: notification.createdAt.toISOString(),
      updatedAt: notification.updatedAt.toISOString(),
    };
  }
}
