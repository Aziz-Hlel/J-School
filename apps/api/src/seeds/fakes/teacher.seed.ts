import { prisma } from '@/bootstrap/db.init';
import { TX } from '@/types/prisma/PrismaTransaction';

export class TeacherSeed {
  run = async (params: { userId: string }, tx?: TX) => {
    const { userId } = params;
    const client = tx ?? prisma;
    const teacher = await client.teacher.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
    });

    return teacher;
  };
}
