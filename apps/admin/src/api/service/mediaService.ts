import type { PresignedUrlRequest } from '@repo/contracts/schemas/media/PresignedUrlRequest';
import type { PresignedUrlResponse } from '@repo/contracts/schemas/media/PresignedUrlResponse';
import { apiService } from '../apiService';
import { apiRoutes } from '../routes';

export const mediaService = {
  presignedUrl: (payload: PresignedUrlRequest) =>
    apiService.post<PresignedUrlResponse>(apiRoutes.media.presignedUrl(), payload),
};
