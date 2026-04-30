import { prisma } from '@/bootstrap/db.init';
import { RepoError } from '@/err/repo/DbError';
import { RepoError_V2 } from '@/err/repo/DbError.v2';
import { TX } from '@/types/prisma/PrismaTransaction';
import { CreateClassroomRequest } from '@repo/contracts/schemas/classroom/createClassRequest';
import { UpdateClassroomRequest } from '@repo/contracts/schemas/classroom/updateClassRequest';
import { Prisma } from '@repo/db/prisma/client';

export class ClassroomRepo {
  create = async (params: { input: CreateClassroomRequest; schoolId: string }, tx?: TX) => {
    try {
      const { input, schoolId } = params;
      const client = tx ?? prisma;
      const createdClass = await client.classroom.create({
        data: {
          ...input,
          schoolId,
        },
      });
      return createdClass;
    } catch (error) {
      RepoError_V2.handleRepoError(error);
    }
  };

  update = async (params: { input: UpdateClassroomRequest; classroomId: string; schoolId: string }, tx?: TX) => {
    const { input, classroomId, schoolId } = params;
    try {
      const client = tx ?? prisma;
      const updatedClass = await client.classroom.update({
        where: { id: classroomId, schoolId },
        data: input,
      });
      return updatedClass;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  find = async (params: { classroomId: string; schoolId: string }, tx?: TX) => {
    const { classroomId, schoolId } = params;
    const client = tx ?? prisma;
    try {
      return await client.classroom.findUnique({
        where: { id: classroomId, schoolId },
      });
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  findAll = async (params: {
    skip: number;
    take: number;
    where: Prisma.ClassroomWhereInput;
    orderBy: Prisma.ClassroomOrderByWithRelationInput;
    schoolId: string;
  }) => {
    const { skip, take, where, orderBy, schoolId } = params;
    const classrooms = prisma.classroom.findMany({
      skip,
      take,
      where: { ...where, schoolId },
      orderBy,
    });
    const classroomsCount = prisma.classroom.count({ where: { ...where, schoolId } });

    const [content, totalElements] = await Promise.all([classrooms, classroomsCount]);

    return { content, totalElements };
  };
}
