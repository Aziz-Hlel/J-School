import { CursorMapper } from '@/helper/cursor.mapper';
import { globalNotificationQueue } from '@/mq/notification.queue';
import { CreateNotificationInternal } from '@repo/contracts/schemas/Notification2/create.internal';
import { NotificationCursorSchema } from '@repo/contracts/schemas/Notification2/notificationQueryParam';
import prisma from '@repo/db';
import { Prisma } from '@repo/db/prisma/browser';
import { NotificationScheduleType, NotificationType } from '@repo/db/prisma/enums';
import { NotificationMapper } from './notification.mapper';

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
        sourceType: input.sourceType,
        role: input.userRole,
        students: {
          connect: input.studentIds?.map((studentId) => ({ id: studentId })),
        },
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
            : { type: 'GROUP', userIds: input.type.accountIds },
        schedule: {
          scheduleType: 'DELAYED',
          delaySeconds: 0,
        },
      },
    });
  };

  update = async () => {};
  delete = async () => {};
  find = async (params: { schoolId: string; cursorParam: NotificationCursorSchema }) => {
    const { schoolId, cursorParam } = params;

    const where: Prisma.NotificationWhereInput = {
      schoolId,
      ...(cursorParam.studentId && { students: { some: { id: cursorParam.studentId } } }),
      ...(cursorParam.role && {
        OR: [{ role: cursorParam.role }, { role: null }],
      }),
    };

    const queryResponse = await prisma.notification.findMany({
      where,
      cursor: cursorParam.cursor ? { id: cursorParam.cursor } : undefined,
      take: cursorParam.limit + 1,
      skip: cursorParam.cursor ? 1 : 0,
      include: {
        title: true,
        content: true,
      },
    });

    const lastItem = queryResponse[cursorParam.limit];
    const nextCursor = lastItem?.id || null;
    const notifications = queryResponse.slice(0, cursorParam.limit);

    const dataResponse = notifications.map(NotificationMapper.toResponse);

    const response = CursorMapper.toCursor({
      data: dataResponse,
      nextCursor,
    });
    return response;
  };
}

export const globalNotificationService = new NotificationService();
