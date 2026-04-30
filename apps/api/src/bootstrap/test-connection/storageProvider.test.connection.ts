import { storageService } from '@/storage/storage.service';

export async function storageProviderTestConnection() {
  await storageService.verifyConnection();
}
