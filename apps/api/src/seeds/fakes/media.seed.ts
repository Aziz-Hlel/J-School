import { prisma } from '@/bootstrap/db.init';
import { MediaStatus, MediaType } from '@repo/db/prisma/enums';
import { MediaCreateInput } from '@repo/db/prisma/models';
import { TX } from '@/types/prisma/PrismaTransaction';
import { faker } from '@faker-js/faker';

export class MediaSeed {
  private readonly VideosPlacholderUrls = [
    {
      url: 'https://lorem.video/cat_720p',
      baseName: 'cat',
    },
    {
      url: 'https://lorem.video/dog_720p',
      baseName: 'dog',
    },
    {
      url: 'https://lorem.video/bunny_720p',
      baseName: 'bunny',
    },
    {
      url: 'https://lorem.video/corgi_720p',
      baseName: 'corgi',
    },
    {
      url: 'https://lorem.video/test_720p',
      baseName: 'test',
    },
  ];

  private generateFakeMediaInstance = (media: Partial<MediaCreateInput> = {}): MediaCreateInput => {
    if (media.type === MediaType.VIDEO) {
      const video = faker.helpers.arrayElement(this.VideosPlacholderUrls);
      return {
        ...media,
        baseName: media.baseName ?? video.baseName,
        key: media.key ?? video.url,
        mimeType: media.mimeType ?? 'video/mp4',
        fileSize: media.fileSize ?? 100 * 100 * 100,
        status: media.status ?? MediaStatus.CONFIRMED,
        type: media.type ?? MediaType.VIDEO,
      };
    }
    return {
      ...media,
      baseName: media.baseName ?? faker.lorem.slug(),
      key: media.key ?? faker.image.avatar(),
      mimeType: media.mimeType ?? 'image/png',
      fileSize: media.fileSize ?? 100 * 100,
      status: media.status ?? MediaStatus.CONFIRMED,
      type: media.type ?? MediaType.IMAGE,
    };
  };

  run = async (params?: { media?: Partial<MediaCreateInput> }, tx?: TX) => {
    const { media } = params ?? {};
    const mediaInstance = this.generateFakeMediaInstance(media);
    const client = tx ?? prisma;
    const createdMedia = await client.media.upsert({
      where: {
        key: mediaInstance.key,
      },
      update: {},
      create: mediaInstance,
    });
    return createdMedia;
  };
}
