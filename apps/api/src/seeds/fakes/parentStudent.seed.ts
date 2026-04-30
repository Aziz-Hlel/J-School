import { TX } from '@/types/prisma/PrismaTransaction';
import { prisma } from '@/bootstrap/db.init';

export class ParentStudentSeed {
  run = async (params: { parentId: string; studentId: string }, tx?: TX) => {
    const { parentId, studentId } = params;
    const client = tx ?? prisma;
    return await client.studentParents.upsert({
      where: {
        parentId_studentId: {
          parentId,
          studentId,
        },
      },
      create: {
        parentId,
        studentId,
      },
      update: {},
    });
  };
}
