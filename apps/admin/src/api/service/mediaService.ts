import type { PresignedUrlRequest } from '@repo/contracts/schemas/media/PresignedUrlRequest';
import { apiService } from '../apiService';
import apiRoutes from '../routes/routes';
import type { PresignedUrlResponse } from '@repo/contracts/schemas/media/PresignedUrlResponse';

export const mediaService = {
  presignedUrl: (payload: PresignedUrlRequest) =>
    apiService.post<PresignedUrlResponse>(apiRoutes.media.presignedUrl(), payload),
};
