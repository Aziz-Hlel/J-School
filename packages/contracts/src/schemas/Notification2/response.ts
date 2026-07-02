import type { NotificationSourceType, NotificationType } from '@repo/db/prisma/client';

export type NotificationClientResponse = {
  id: string;

  title: {
    en: string;
    fr: string;
    ar: string;
  };
  content: {
    en: string;
    fr: string;
    ar: string;
  };

  type: NotificationType;
  sourceType: NotificationSourceType;
  sourceId: string | null;

  createdAt: string;
  updatedAt: string;
};
