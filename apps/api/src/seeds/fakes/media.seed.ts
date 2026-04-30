import { prisma } from '@/bootstrap/db.init';
import { MediaStatus } from '@repo/db/prisma/enums';
import { MediaCreateInput } from '@repo/db/prisma/models';
import { TX } from '@/types/prisma/PrismaTransaction';
import { faker } from '@faker-js/faker';

export class MediaSeed {
  private generateFakeMediaInstance = (media: Partial<MediaCreateInput> = {}): MediaCreateInput => {
    return {
      ...media,
      baseName: media.baseName ?? faker.lorem.slug(),
      key: media.key ?? faker.image.avatar(),
      mimeType: media.mimeType ?? 'image/png',
      fileSize: media.fileSize ?? 100 * 100,
      status: media.status ?? MediaStatus.CONFIRMED,
      type: media.type ?? 'IMAGE',
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
