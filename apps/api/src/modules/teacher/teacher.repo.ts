import { prisma } from '@/bootstrap/db.init';
import { DatabaseError } from '@/err/service/customErrors';
import { TX } from '@/types/prisma/PrismaTransaction';
import { Prisma } from '@repo/db/prisma/client';

export class TeacherRepo {
  create = async ({ userId }: { userId: string }, tx?: TX) => {
    try {
      const client = tx ?? prisma;
      return await client.teacher.create({
        data: {
          userId,
        },
        include: {
          assignments: {},
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (!(error instanceof Error)) throw error;
        throw new DatabaseError({ message: 'Failed to create teacher', cause: error });
      }
      throw error;
    }
  };

  findById = async <T extends Prisma.TeacherInclude | {}>(
    { id }: { id: string },
    params: { include: T } = { include: {} as T },
  ) => {
    try {
      return await prisma.teacher.findUnique({
        where: { id },
        include: params.include,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (!(error instanceof Error)) throw error;
        throw new DatabaseError({ message: 'Failed to find teacher', cause: error });
      }
      throw error;
    }
  };

  findByUserId = async <T extends Prisma.TeacherInclude>(
    { userId }: { userId: string },
    { include }: { include: T } = { include: {} as T },
  ) => {
    try {
      return await prisma.teacher.findUnique({
        where: {
          userId,
        },
        include,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (!(error instanceof Error)) throw error;
        throw new DatabaseError({ message: 'Failed to find teacher', cause: error });
      }
      throw error;
    }
  };

  findAll = async <T extends Prisma.TeacherInclude>(
    params: {
      skip: number;
      take: number;
      where: Prisma.TeacherWhereInput;
      orderBy: Prisma.TeacherOrderByWithRelationInput;
      schoolId: string;
    },
    include: T,
  ) => {
    const { skip, take, where, orderBy, schoolId } = params;
    const teachers = prisma.teacher.findMany({
      skip,
      take,
      where: { ...where, user: { schoolId } },
      include,
      orderBy,
    });
    const teachersCount = prisma.teacher.count({ where: { ...where, user: { schoolId } } });

    const [content, totalElements] = await Promise.all([teachers, teachersCount]);

    return { content, totalElements };
  };
}
