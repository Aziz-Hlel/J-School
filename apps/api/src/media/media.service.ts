import { storageService } from '@/storage/storage.service';
import { PresignedUrlRequest } from '@repo/contracts/schemas/media/PresignedUrlRequest';
import { MediaRepo, singletonMediaRepo } from './media.repo';
import { NotFoundError } from '@/err/service/customErrors';
import { MediaStatus } from '@repo/db/prisma/enums';
import { PresignedUrlResponse } from '@repo/contracts/schemas/media/PresignedUrlResponse';
import { Media } from '@repo/db/prisma/client';
import { MediaResponse } from '@repo/contracts/schemas/media/MediaResponse';
import { MediaDelegate } from '@repo/db/prisma/models';
import { DefaultArgs } from '@prisma/client/runtime/client';

export interface IMediaService {
  getPresignedUrl(schema: PresignedUrlRequest): Promise<PresignedUrlResponse>;
  deleteMediaById(props: { mediaId: string; tx?: MediaDelegate<DefaultArgs, { omit: undefined }> }): Promise<void>;
  confirmMediaUploadByKey(mediaKey: string): Promise<void>;
  confirmMediaUploadById(mediaId: string): Promise<void>;
  switchMediaIds({
    oldMediaKey,
    newMediaKey,
  }: {
    oldMediaKey: string | null;
    newMediaKey: string;
  }): Promise<string | null>;
  getMediaKeyAndUrl(media: Media | null): MediaResponse | null;
  generateMediaResponse(media: Media | null): MediaResponse | null;
}

export class MediaService implements IMediaService {
  constructor(private readonly mediaRepo: MediaRepo) {}
  async getPresignedUrl(schema: PresignedUrlRequest): Promise<PresignedUrlResponse> {
    const mediaKey = storageService.generateMediaKey(schema.name);
    const { mimeType } = schema;
    const expiresIn = 3600;

    const createdMedia = await this.mediaRepo.createPendingMedia(schema, mediaKey);

    const signedUrl = await storageService.generatePresignedUrl({
      mediaKey,
      mimeType,
      expiresIn,
    });

    return {
      id: createdMedia.id,
      url: signedUrl,
      key: mediaKey,
    };
  }

  async deleteMediaById(props: { mediaId: string; tx?: MediaDelegate<DefaultArgs, { omit: undefined }> }) {
    const media = await this.mediaRepo.findMediaById({ mediaId: props.mediaId, tx: props.tx });
    if (!media) return;

    await this.mediaRepo.deleteMediaById({ mediaId: props.mediaId, tx: props.tx });
  }

  async confirmMediaUploadByKey(mediaKey: string) {
    const media = await this.mediaRepo.findMediaByKey(mediaKey);

    if (!media) throw new NotFoundError(`Media with key ${mediaKey} not found`);

    if (media.status !== MediaStatus.PENDING)
      throw new Error(`try to CONFIRM Media with key ${mediaKey} which is not in PENDING status`);

    await this.mediaRepo.confirmMediaUploadByKey(mediaKey);
  }

  async confirmMediaUploadById(mediaId: string) {
    const media = await this.mediaRepo.findMediaById({ mediaId });

    if (!media) throw new NotFoundError(`Media with id ${mediaId} not found`);

    if (media.status !== MediaStatus.PENDING)
      throw new Error(`try to CONFIRM Media with id ${mediaId} which is not in PENDING status`);

    await this.mediaRepo.confirmMediaUploadById(mediaId); // ! ouslt houni
  }

  async switchMediaIds({ oldMediaKey, newMediaKey }: { oldMediaKey: string | null; newMediaKey: string }) {
    return await this.mediaRepo.switchMediaIds({
      oldMediaId: oldMediaKey,
      newMediaId: newMediaKey,
    });
  }

  getMediaKeyAndUrl(media: Media | null): MediaResponse | null {
    if (!media) return null;
    const url = storageService.getObjectUrl(media.key);

    return {
      id: media.id,
      key: media.key,
      url,
    };
  }

  generateMediaResponse(media: Media | null): MediaResponse | null {
    if (!media) return null;
    const url = storageService.getObjectUrl(media.key);
    return {
      id: media.id,
      key: media.key,
      url,
    };
  }
}

export const globalMediaService = new MediaService(singletonMediaRepo);
