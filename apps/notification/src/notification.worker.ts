import getRedisClient from '@repo/cache';
import QUEUE_NAMES from '@repo/contracts/const/queues.name';
import type { NotificationJob } from '@repo/contracts/jobs/notificationJob';
import { Job, Worker } from 'bullmq';
import { NotificationService } from './notification.service';
import type { IWorker } from './types/IWorker';

export class NotificationWorker implements IWorker<NotificationJob> {
  constructor(private readonly notificationService: NotificationService) {}
  private readonly workers: Worker<NotificationJob>[] = [];

  handleJob = async (job: Job<NotificationJob>) => {
    const data = job.data;
    await this.notificationService.sendNotification(data);
  };

  createWorker = async () => {
    const redisClient = await getRedisClient();
    const worker = new Worker(QUEUE_NAMES.notification, this.handleJob, {
      connection: redisClient,
    });

    worker.on('completed', (job) => {
      console.log(`✅ Job id: ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
      console.error(`❌ Job id: ${job?.id} failed`, err);
    });

    this.workers.push(worker);
  };

  close = async () => {
    await Promise.all(this.workers.map((w) => w.close()));
  };

  getWorkers = () => {
    return this.workers;
  };
}
