import type { IWorker } from '@/types/IWorker';
import getRedisClient from '@repo/cache';
import QUEUE_NAMES from '@repo/contracts/const/queues.name';
import type { OcrJob } from '@repo/contracts/jobs/ocrJob';
import { Job, Worker } from 'bullmq';
import type { OcrService } from './ocr.service';

export class OcrWorker implements IWorker<OcrJob> {
  constructor(private readonly ocrService: OcrService) {}
  private readonly workers: Worker<OcrJob>[] = [];

  handleJob = async (job: Job<OcrJob>) => await this.ocrService.processHomework(job.data);

  createWorker = async () => {
    const redisClient = await getRedisClient();
    const worker = new Worker(QUEUE_NAMES.ocr, this.handleJob, {
      connection: redisClient,
    });

    worker.on('completed', (job) => {
      console.log(`✅ Job id: ${job.id} completed`);
      console.log('job payload :\t', job.data);
      console.log('-----');
      console.log('\n');
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
