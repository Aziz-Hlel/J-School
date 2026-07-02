import type { NotificationSourceType } from '@repo/db/prisma/browser';

export type NotificationCountRes = {
  sourceType: NotificationSourceType;
  count: number;
};
