import type { UserFullResponse } from '../user/UserFullResponse';
import type { CreateNotificationRequest } from './createNotification';
import type { NotificationRecipient } from './types/notificationRecipient';
import type { NotificationScheduleResponse } from './types/notificationSchedule';

export type NotificationResponse = {
  id: string;
  description: string | null;
  recipients: NotificationRecipient;
  payload: CreateNotificationRequest['payload'];
  schedule: NotificationScheduleResponse;
  isSuccessful: boolean | null;
  createdBy: UserFullResponse;
  createdAt: string;
  updatedAt: string;
};
