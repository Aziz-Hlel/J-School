import { globalNotificationQueue } from '@/mq/notification.queue';
import { CreateNotificationInternal } from '@repo/contracts/schemas/Notification2/create.internal';
import prisma from '@repo/db';
import { NotificationScheduleType, NotificationType } from '@repo/db/prisma/enums';

export class NotificationService {
  constructor() {}
  create = async (params: { input: CreateNotificationInternal }) => {
    const { input } = params;

    const notification = await prisma.notification.create({
      data: {
        title: {
          create: {
            en: input.title.en,
            fr: input.title.fr ?? '',
            ar: input.title.ar ?? '',
          },
        },
        content: {
          create: {
            en: input.content.en,
            fr: input.content.fr ?? '',
            ar: input.content.ar ?? '',
          },
        },
        type: input.type.type,
        sourceId: input.sourceId,
        schoolId: input.schoolId,
        scheduleType: NotificationScheduleType.IMMEDIATE,
      },
    });

    globalNotificationQueue.add({
      delay: 0,
      payload: {
        id: notification.id,
        titles: input.title,
        contents: input.content,
        data: input.content,
        targeting:
          input.type.type === NotificationType.GLOBAL
            ? { type: 'ALL' }
            : { type: 'GROUP', userIds: input.type.userIds },
        schedule: {
          scheduleType: 'DELAYED',
          delaySeconds: 0,
        },
      },
    });
  };
  update = async () => {};
  delete = async () => {};
  find = async () => {};
}
