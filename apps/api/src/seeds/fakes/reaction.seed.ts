import { TX } from '@/types/prisma/PrismaTransaction';
import prisma from '@repo/db';
import { ReactionType } from '@repo/db/prisma/enums';

export class ReactionSeed {
  run = async (
    params: { schoolId: string; announcementId: string; accountEmail: string; reactionType: ReactionType },
    tx?: TX,
  ) => {
    const { schoolId, announcementId, accountEmail, reactionType } = params;
    const client = tx ?? prisma;

    const user = await client.user.findFirst({
      where: {
        account: { email: accountEmail },
        schoolId,
      },
      select: { id: true },
    });
    if (!user) throw new Error('User not found');

    await client.reaction.upsert({
      where: { annoucementId_userId: { annoucementId: announcementId, userId: user.id } },
      update: { type: reactionType },
      create: { annoucementId: announcementId, userId: user.id, type: reactionType },
    });
  };
}
