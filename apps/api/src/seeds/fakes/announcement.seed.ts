import { TX } from '@/types/prisma/PrismaTransaction';
import { faker } from '@faker-js/faker';
import prisma from '@repo/db';

export class AnnouncementSeed {
  run = async (params: { schoolId: string; description: string; mediaIds: string[]; createdAt: Date }, tx?: TX) => {
    const { schoolId, description, mediaIds, createdAt } = params;
    const client = tx || prisma;
    const announcement = await client.announcement.findFirst({
      where: {
        schoolId,
        createdAt,
      },
    });
    await prisma.announcement.upsert({
      where: {
        id: announcement?.id ?? faker.string.uuid(),
      },
      update: {},
      create: {
        schoolId,
        description,

        media: {
          connect: mediaIds.map((id) => ({ id })),
        },
        createdAt,
      },
    });
  };
}
