import { Prisma } from '@repo/db/prisma/client';
import { ParentStudentRepo } from './parentStudent.repo';
import { PrismaErrorCode } from '@/err/repo/PrismaErrorCode';
import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { TX } from '@/types/prisma/PrismaTransaction';

export class ParentStudentService {
  constructor(private readonly parentStudentRepo: ParentStudentRepo) {}

  assignStudentToParent = async (input: { parentId: string; studentId: string; schoolId: string }, tx?: TX) => {
    try {
      const parentStudent = await this.parentStudentRepo.create(input, tx);
      return parentStudent;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.NOT_FOUND) {
          throw new NotFoundError({ message: 'Parent or student not found', cause: error });
        }
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT) {
          throw new ConflictError({ message: 'Parent or student already assigned', cause: error });
        }
      }
      throw error;
    }
  };

  unassignStudentFromParent = async (input: { parentId: string; studentId: string; schoolId: string }, tx?: TX) => {
    try {
      const parentStudent = await this.parentStudentRepo.delete(input, tx);
      return parentStudent;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.NOT_FOUND) {
          throw new NotFoundError({ message: 'Parent or student not found', cause: error });
        }
      }
      throw error;
    }
  };
}
