import { TX } from '@/types/prisma/PrismaTransaction';
import { faker } from '@faker-js/faker';
import prisma from '@repo/db';
import { FeeItemStatus } from '@repo/db/prisma/enums';

export class FeeItemSeed {
  run = async (
    params: { schoolId: string; id: string; feeId: string; title: string; description: string; amount: number },
    tx?: TX,
  ) => {
    const { schoolId, id, feeId, title, description, amount } = params;
    const client = tx || prisma;
    await client.feeItem.upsert({
      where: {
        id,
      },
      update: {},
      create: {
        id,
        feeId,
        title,
        description,
        amount,
        status: faker.helpers.arrayElement(Object.values(FeeItemStatus)),
      },
    });
  };
}
