import ENV from '@/env';
import { OCR_PROMPT } from '@/prompts/ocr';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { OcrJob } from '@repo/contracts/jobs/ocrJob';
import prisma from '@repo/db';
import { MediaType } from '@repo/db/prisma/browser';
import type { OcrProvider } from './ocr.provider';

interface AwsStorageConfig {
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_S3_BUCKET: string;
}

export class AwsStorageService {
  client: S3Client;
  config: AwsStorageConfig;

  constructor() {
    this.config = {
      AWS_REGION: ENV.AWS_REGION,
      AWS_ACCESS_KEY_ID: ENV.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: ENV.AWS_SECRET_ACCESS_KEY,
      AWS_S3_BUCKET: ENV.AWS_S3_BUCKET,
    };
    this.client = new S3Client({
      region: this.config.AWS_REGION,
      credentials: {
        accessKeyId: this.config.AWS_ACCESS_KEY_ID,
        secretAccessKey: this.config.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  getMediaBuffer = async (key: string): Promise<Buffer> => {
    const res = await this.client.send(new GetObjectCommand({ Bucket: this.config.AWS_S3_BUCKET, Key: key }));
    const stream = res.Body as NodeJS.ReadableStream;
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  };
}

export class OcrService {
  constructor(
    private readonly storageService: AwsStorageService,
    private readonly ocrProvider: OcrProvider,
  ) {}

  fetchHomework = async (homeworkId: string) => {
    console.log('id :', homeworkId);
    const homework = await prisma.homework.findUniqueOrThrow({
      where: {
        id: homeworkId,
      },
      select: {
        id: true,
        files: true,
      },
    });

    return homework;
  };

  processHomework = async (payload: OcrJob) => {
    const homework = await this.fetchHomework(payload.homeworkId);

    const contentBlock: { type: string; source: { type: string; media_type?: string; data: string } }[] =
      await Promise.all(
        homework.files.map(async (file) => {
          const type = MediaType.DOCUMENT ? 'document' : 'image';
          const buffer = await this.storageService.getMediaBuffer(file.key);
          return {
            type,
            source: { type: 'base64', media_type: file.mimeType, data: buffer.toString('base64') },
          };
        }),
      );

    const body = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 4000,
      system: OCR_PROMPT,
      messages: [
        {
          role: 'user',
          content: [...contentBlock, { type: 'text', text: 'Extract all exercises from this homework as JSON.' }],
        },
      ],
    };

    console.log('body = ', body);
    const res = await this.ocrProvider.invokeOcr({ body });
  };
}
