import { prisma } from '@/bootstrap/db.init';
import { TX } from '@/types/prisma/PrismaTransaction';

export class ParentSeed {
  runV2 = async (params: { parentId: string; userId: string }, tx?: TX) => {
    const { parentId, userId } = params;
    const client = tx ?? prisma;
    const createdParent = await client.parent.upsert({
      where: {
        userId,
      },
      create: {
        id: parentId,
        userId,
      },
      update: {},
    });
    return createdParent;
  };

  run = async (params: { userId: string }, tx?: TX) => {
    const { userId } = params;
    const client = tx ?? prisma;
    const createdParent = await client.parent.upsert({
      where: {
        userId,
      },
      create: {
        userId,
      },
      update: {},
    });
    return createdParent;
  };
}
