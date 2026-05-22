import type { NotificationJob } from '@repo/contracts/jobs/notificationJob';
import { NotificationProvider } from './notification.provider';

export class NotificationService {
  constructor(private readonly notificationProvider: NotificationProvider) {}
  async sendNotification(payload: NotificationJob) {
    await this.notificationProvider.send(payload);
  }
}
