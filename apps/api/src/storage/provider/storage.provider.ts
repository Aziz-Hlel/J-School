import ENV from '@/config/env';
import { IStorageProvider } from '../interface/storage.interface';
import { MinioService } from './minio.service';
import { AwsStorageService } from './awsStorage.service';

export function createStorageProvider(): IStorageProvider {
  switch (ENV.NODE_ENV) {
    case 'dev':
    case 'build':
      return new MinioService({
        MINIO_REGION: ENV.MINIO_REGION,
        MINIO_PORT: ENV.MINIO_PORT,
        MINIO_ROOT_USER: ENV.MINIO_ROOT_USER,
        MINIO_ROOT_PASSWORD: ENV.MINIO_ROOT_PASSWORD,
        MINIO_BUCKET: ENV.MINIO_BUCKET,
      });

    case 'production':
    case 'stage':
      return new AwsStorageService({
        AWS_REGION: ENV.AWS_REGION,
        AWS_ACCESS_KEY_ID: ENV.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: ENV.AWS_SECRET_ACCESS_KEY,
        AWS_S3_BUCKET: ENV.AWS_S3_BUCKET,
        AWS_CLOUDFRONT_URL: ENV.AWS_CLOUDFRONT_URL,
      });
  }
}

export const StorageProvider: IStorageProvider = createStorageProvider();
