import { NotFoundError } from '@/err/service/customErrors';
import { storageService } from '@/storage/storage.service';
import { TX } from '@/types/prisma/PrismaTransaction';
import { MediaResponse } from '@repo/contracts/schemas/media/MediaResponse';
import { MediaResponseWithOrder } from '@repo/contracts/schemas/media/MediaResponseWithOrder';
import { PresignedUrlRequest } from '@repo/contracts/schemas/media/PresignedUrlRequest';
import { PresignedUrlRequestList } from '@repo/contracts/schemas/media/PresignedUrlRequestList';
import { PresignedUrlResponse } from '@repo/contracts/schemas/media/PresignedUrlResponse';
import { Media } from '@repo/db/prisma/client';
import { MediaStatus } from '@repo/db/prisma/enums';
import { MediaRepo, singletonMediaRepo } from './media.repo';

export interface IMediaService {
  getPresignedUrl(schema: PresignedUrlRequest): Promise<PresignedUrlResponse>;
  deleteMediaById(props: { mediaId: string; tx?: TX }): Promise<void>;
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
  toMediaRes(media: Media | null): MediaResponse | null;
  getPresignedUrls(schema: PresignedUrlRequestList): Promise<PresignedUrlResponse[]>;
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

  async deleteMediaById(props: { mediaId: string; tx?: TX }) {
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
      type: media.type,
      blurHash: media.blurHash,
      url,
    };
  }

  toMediaRes(media: Media): MediaResponse;
  toMediaRes(media: null): null;
  toMediaRes(media: Media | null): MediaResponse | null;
  toMediaRes(media: Media | null): MediaResponse | null {
    if (!media) return null;
    const url = storageService.getObjectUrl(media.key);
    return {
      id: media.id,
      key: media.key,
      type: media.type,
      blurHash: media.blurHash,
      url,
    };
  }

  public toMediaResWithOrder(media: Media): MediaResponseWithOrder;
  public toMediaResWithOrder(media: null): null;
  public toMediaResWithOrder(media: Media | null): MediaResponseWithOrder | null;
  public toMediaResWithOrder(media: Media | null) {
    if (!media) return null;

    const url = storageService.getObjectUrl(media.key);
    return {
      id: media.id,
      url,
      order: media.order,
      type: media.type,
      blurHash: media.blurHash,
    };
  }

  async getPresignedUrls(schema: PresignedUrlRequestList): Promise<PresignedUrlResponse[]> {
    const expiresIn = 3600;
    const createdMedias = await Promise.all(
      schema.files.map(async (file) => {
        const mediaKey = storageService.generateMediaKey(file.name);
        return await this.mediaRepo.createPendingMedia(file, mediaKey);
      }),
    );

    const signedUrls = await Promise.all(
      createdMedias.map(async (media) => {
        return await storageService.generatePresignedUrl({
          mediaKey: media.key,
          mimeType: media.mimeType,
          expiresIn,
        });
      }),
    );

    return createdMedias.map((media, index) => ({
      id: media.id,
      url: signedUrls[index]!,
      key: media.key,
    }));
  }
}

export const globalMediaService = new MediaService(singletonMediaRepo);
