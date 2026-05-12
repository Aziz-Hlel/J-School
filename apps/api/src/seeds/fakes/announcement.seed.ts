import { TX } from '@/types/prisma/PrismaTransaction';
import prisma from '@repo/db';

export class AnnouncementSeed {
  run = async (
    params: { id: string; schoolId: string; description: string; mediaIds: string[]; createdAt: Date },
    tx?: TX,
  ) => {
    const { id, schoolId, description, mediaIds, createdAt } = params;
    const client = tx || prisma;

    await client.announcement.upsert({
      where: {
        id,
      },
      update: {},
      create: {
        id,
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
