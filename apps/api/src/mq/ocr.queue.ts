import redis from '@/bootstrap/redis.init';
import QUEUE_NAMES from '@repo/contracts/const/queues.name';
import { OcrJob } from '@repo/contracts/jobs/ocrJob';
import { Queue } from 'bullmq';

type AddOcrJobProps = {
  payload: OcrJob;
};

export interface IOcrQueue {
  add(props: AddOcrJobProps): Promise<void>;
}

export class OcrQueue implements IOcrQueue {
  private queue: Queue<OcrJob>;

  constructor() {
    this.queue = new Queue<OcrJob>(QUEUE_NAMES.ocr, {
      connection: redis,
      defaultJobOptions: {
        attempts: 3, // retry up to 3 times
        backoff: { type: 'exponential', delay: 5000 }, // retry with exponential backoff
        removeOnComplete: true, // auto remove successful jobs
        removeOnFail: false, // keep failed jobs for inspection
      },
    });
  }

  add = async ({ payload }: AddOcrJobProps) => {
    await this.queue.add(QUEUE_NAMES.ocr, payload);
  };
}

export const globalOcrQueue = new OcrQueue();
