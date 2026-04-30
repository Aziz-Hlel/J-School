import { prisma } from '@/bootstrap/db.init';
import { logger } from '@/bootstrap/logger.init';
import { MediaStatus, MediaType } from '@repo/db/prisma/enums';
import { MediaTransaction } from '@/types/transactions';
import { PresignedUrlRequest } from '@repo/contracts/schemas/media/PresignedUrlRequest';

export class MediaRepo {
  async createPendingMedia(preSignedUrlDto: PresignedUrlRequest, mediaKey: string) {
    const createdMedia = await prisma.media.create({
      data: {
        baseName: preSignedUrlDto.name,
        type: MediaType.IMAGE, // ! just add it to bypass compilation eror look into it afterwards
        key: mediaKey,
        mimeType: preSignedUrlDto.mimeType,
        fileSize: preSignedUrlDto.fileSize,
        // fileType: preSignedUrlDto.fileType,
        status: MediaStatus.PENDING,
      },
    });

    return createdMedia;
  }

  async findMediaById(props: { mediaId: string; tx?: MediaTransaction }) {
    const orm = props.tx ?? prisma.media;
    const media = await orm.findUnique({
      where: {
        id: props.mediaId,
      },
    });

    return media;
  }

  async findMediaByKey(mediaKey: string) {
    const media = await prisma.media.findUnique({
      where: {
        key: mediaKey,
      },
    });

    return media;
  }

  async confirmMediaUploadByKey(mediaKey: string) {
    await prisma.media.update({
      where: {
        key: mediaKey,
      },
      data: {
        status: MediaStatus.CONFIRMED,
      },
    });
  }

  async confirmMediaUploadById(mediaId: string) {
    await prisma.media.update({
      where: {
        id: mediaId,
      },
      data: {
        status: MediaStatus.CONFIRMED,
      },
    });
  }

  async deleteMediaById(props: { mediaId: string; tx?: MediaTransaction }) {
    const orm = props.tx ?? prisma.media;
    await orm.update({
      where: {
        id: props.mediaId,
      },
      data: {
        status: MediaStatus.DELETED,
      },
    });
  }

  async switchMediaIds({
    oldMediaId,
    newMediaId,
  }: {
    oldMediaId: string | null;
    newMediaId: string;
  }): Promise<string | null> {
    const mediaId = await prisma.$transaction(async (tx) => {
      const newMedia = await tx.media.findUnique({
        where: {
          id: newMediaId,
        },
      });
      if (!newMedia) {
        logger.error(`Updated Media with id ${newMediaId} not found`);
        return oldMediaId;
      }
      const isNewMediaPending = newMedia.status === MediaStatus.PENDING;
      if (!isNewMediaPending) {
        logger.fatal(`Try to switch Media ids but the new Media with id ${newMediaId} is not in PENDING status`);
        return oldMediaId;
      }
      const hasNewMediaExceedOneHour = newMedia.createdAt.getTime() + 60 * 60 * 1000 < Date.now();
      if (hasNewMediaExceedOneHour) {
        logger.fatal(`Try to switch Media ids but the new Media with id ${newMediaId} exceed 1 hour since creation`);
        return oldMediaId;
      }
      if (oldMediaId) {
        const oldMedia = await tx.media.findUnique({
          where: {
            id: oldMediaId,
          },
        });
        if (oldMedia) {
          await tx.media.update({
            where: {
              id: oldMediaId,
            },
            data: {
              status: MediaStatus.DELETED,
            },
          });
        }
      }
      const updatedNewMedia = await tx.media.update({
        where: {
          id: newMediaId,
        },
        data: {
          status: MediaStatus.CONFIRMED,
        },
      });
      return updatedNewMedia.id;
    });
    return mediaId;
  }
}

export const singletonMediaRepo = new MediaRepo();
