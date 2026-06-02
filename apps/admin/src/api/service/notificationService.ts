import type { CreateNotificationRequest } from '@repo/contracts/schemas/notification/createNotification';
import { apiService } from '../apiService';
import apiRoutes from '../routes/routes';
import type { Page } from '@repo/contracts/types/page/Page';
import type { NotificationResponse } from '@repo/contracts/schemas/notification/notificationResponse';

const notificationService = {
  getPage: async (searchParams: { [k: string]: string | number | Array<string> }) =>
    apiService.getThrowable<Page<NotificationResponse>>(apiRoutes.notification.getPage(), searchParams),
  create: async (payload: CreateNotificationRequest) =>
    apiService.postThrowable(apiRoutes.notification.createNotification(), payload),
};

export default notificationService;
