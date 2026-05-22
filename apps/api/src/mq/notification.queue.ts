import redis from '@/bootstrap/redis.init';
import QUEUE_NAMES from '@repo/contracts/const/queues.name';
import { NotificationJob } from '@repo/contracts/jobs/notificationJob';
import { Queue } from 'bullmq';

type AddNotificationProps = {
  payload: NotificationJob;
  delay: number;
};

export interface INotificationQueue {
  add(props: AddNotificationProps): Promise<void>;
}

export class NotificationQueue implements INotificationQueue {
  private queue: Queue<NotificationJob>;
  constructor() {
    this.queue = new Queue<NotificationJob>(QUEUE_NAMES.notification, {
      connection: redis,
      defaultJobOptions: {
        attempts: 3, // retry up to 3 times
        backoff: { type: 'exponential', delay: 5000 }, // retry with exponential backoff
        removeOnComplete: true, // auto remove successful jobs
        removeOnFail: false, // keep failed jobs for inspection
      },
    });
  }

  add = async ({ payload, delay }: AddNotificationProps) => {
    await this.queue.add(QUEUE_NAMES.notification, payload, {
      delay: delay,
      jobId: payload.id,
    });
  };
}

export const globalNotificationQueue = new NotificationQueue();
