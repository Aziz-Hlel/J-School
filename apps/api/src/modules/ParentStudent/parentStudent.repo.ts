import { prisma } from '@/bootstrap/db.init';
import { TX } from '@/types/prisma/PrismaTransaction';

export class ParentStudentRepo {
  create = async (input: { parentId: string; studentId: string }, tx?: TX) => {
    const { parentId, studentId } = input;
    const client = tx ?? prisma;
    const parentStudent = await client.studentParents.create({
      data: {
        parentId,
        studentId,
      },
    });
    return parentStudent;
  };

  delete = async (input: { parentId: string; studentId: string }, tx?: TX) => {
    const { parentId, studentId } = input;
    const client = tx ?? prisma;
    const parentStudent = await client.studentParents.delete({
      where: {
        parentId_studentId: {
          parentId,
          studentId,
        },
      },
    });
    return parentStudent;
  };
}
