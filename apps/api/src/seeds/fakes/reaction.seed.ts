import { TX } from '@/types/prisma/PrismaTransaction';
import prisma from '@repo/db';
import { ReactionType } from '@repo/db/prisma/enums';

export class ReactionSeed {
  run = async (
    params: { schoolId: string; announcementCreation: Date; accountEmail: string; reactionType: ReactionType },
    tx?: TX,
  ) => {
    const { schoolId, announcementCreation, accountEmail, reactionType } = params;
    const client = tx ?? prisma;
    const announcement = await client.announcement.findFirst({
      where: {
        createdAt: announcementCreation,
        schoolId,
      },
      select: { id: true },
    });
    if (!announcement) throw new Error('Announcement not found');

    const user = await client.user.findFirst({
      where: {
        account: { email: accountEmail },
        schoolId,
      },
      select: { id: true },
    });
    if (!user) throw new Error('User not found');

    await client.reaction.upsert({
      where: { annoucementId_userId: { annoucementId: announcement.id, userId: user.id } },
      update: { type: reactionType },
      create: { annoucementId: announcement.id, userId: user.id, type: reactionType },
    });
  };
}
