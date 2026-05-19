import { TX } from '@/types/prisma/PrismaTransaction';
import { prisma } from '@/bootstrap/db.init';
import { faker } from '@faker-js/faker';

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
        emergencyPhone: faker.phone.number(),
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
        emergencyPhone: faker.phone.number(),
        userId,
      },
      update: {},
    });
    return createdParent;
  };
}
