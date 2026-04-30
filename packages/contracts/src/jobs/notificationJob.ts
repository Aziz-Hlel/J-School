import type { NotificationSchedule } from '../schemas/notification/types/notificationSchedule';
import type { NotificationTargetingJob } from './notificationTargetingJob';

export type LocalizedString = {
  en: string;
  ar?: string;
  fr?: string;
};

export type NotificationJob = {
  id: string;
  titles: LocalizedString;
  contents: LocalizedString;
  data: LocalizedString;
  targeting: NotificationTargetingJob;
  schedule: NotificationSchedule;
};
