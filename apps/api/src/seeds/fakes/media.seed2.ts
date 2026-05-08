import { prisma } from '@/bootstrap/db.init';
import { TX } from '@/types/prisma/PrismaTransaction';
import { faker } from '@faker-js/faker';
import { MediaStatus, MediaType } from '@repo/db/prisma/enums';

export const mediaTypeSeed = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  AVATAR: 'AVATAR',
} as const;

export type MediaTypeSeed = (typeof mediaTypeSeed)[keyof typeof mediaTypeSeed];

export class MediaSeedV2 {
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

  private generateFakeMediaInstance = (type: MediaTypeSeed) => {
    let key: string;
    let baseName: string;
    let mediaType: MediaType;
    let mimeType: string;

    switch (type) {
      case mediaTypeSeed.VIDEO:
        const video = faker.helpers.arrayElement(this.VideosPlacholderUrls);
        key = `${video.url}?q=${faker.string.alphanumeric(10)}`;
        baseName = video.baseName;
        mediaType = MediaType.VIDEO;
        mimeType = 'video/mp4';
        break;
      case mediaTypeSeed.IMAGE:
        key = faker.image.avatar();
        baseName = faker.lorem.slug();
        mediaType = MediaType.IMAGE;
        mimeType = 'image/png';
        break;
      case mediaTypeSeed.AVATAR:
        key = faker.image.avatar();
        baseName = faker.lorem.slug();
        mediaType = MediaType.IMAGE;
        mimeType = 'image/png';
        break;
    }

    return {
      baseName,
      key,
      mimeType,
      fileSize: 100 * 100,
      status: MediaStatus.CONFIRMED,
      type: mediaType,
    };
  };

  run = async (params: { type: MediaTypeSeed }, tx?: TX) => {
    const { type } = params;
    const mediaInstance = this.generateFakeMediaInstance(type);
    const client = tx ?? prisma;
    const createdMedia = await client.media.upsert({
      where: { key: mediaInstance.key },
      update: {},
      create: mediaInstance,
    });
    return createdMedia;
  };
}
