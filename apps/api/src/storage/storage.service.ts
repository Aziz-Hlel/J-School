import { PresignedUrlGenerator } from '@repo/contracts/storage/PresignedUrl';
import { IStorageProvider } from './interface/storage.interface';
import { createStorageProvider } from './provider/storage.provider';
import path from 'path';

export class StorageService implements IStorageProvider {
  private storageProvider = createStorageProvider();
  client = this.storageProvider.client;

  async generatePresignedUrl(params: PresignedUrlGenerator): Promise<string> {
    return this.storageProvider.generatePresignedUrl(params);
  }

  getObjectUrl(fileKey: string): string {
    return this.storageProvider.getObjectUrl(fileKey);
  }

  generateMediaKey(mediaName: string): string {
    const ext = path.extname(mediaName);
    const baseName = path.basename(mediaName, ext);
    const safeBase = baseName.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 50);
    const timestamp = Date.now();
    return `${safeBase}-${timestamp}${ext}`;
  }

  async verifyConnection() {
    // const Bucket = ENV.NODE_ENV === 'dev' ? ENV.MINIO_BUCKET : 'ENV.AWS_S3_BUCKET'; // * Adjust l8ter
    try {
      // await this.client.send(new HeadBucketCommand({ Bucket }));
      console.log('✅ SUCCESS : Storage Provider connection successful.');
    } catch (error) {
      console.error('❌ ERROR : Storage Provider connection failed.', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();
