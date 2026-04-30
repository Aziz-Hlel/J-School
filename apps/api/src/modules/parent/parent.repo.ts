import { prisma } from '@/bootstrap/db.init';
import { RepoError } from '@/err/repo/DbError';
import { TX } from '@/types/prisma/PrismaTransaction';

export class ParentRepo {
  create = async (params: { input: { emergencyPhone: string | null }; userId: string; schoolId: string }, tx?: TX) => {
    const { input, userId, schoolId } = params;
    const client = tx ?? prisma;
    try {
      const createdParent = await client.parent.create({
        data: {
          emergencyPhone: input.emergencyPhone,
          user: {
            connect: {
              id: userId,
              schoolId,
            },
          },
        },
      });
      return createdParent;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  update = async (
    params: { input: { emergencyPhone: string | null }; parentId: string; schoolId: string },
    tx?: TX,
  ) => {
    const { input, parentId, schoolId } = params;
    const client = tx ?? prisma;
    try {
      const updatedParent = await client.parent.update({
        where: {
          id: parentId,
          user: {
            schoolId,
          },
        },
        data: {
          emergencyPhone: input.emergencyPhone,
        },
      });
      return updatedParent;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  getByIdAndSchoolId = async (params: { parentId: string; schoolId: string }, tx?: TX) => {
    const { parentId, schoolId } = params;
    const client = tx ?? prisma;
    try {
      const parent = await client.parent.findUnique({
        where: {
          id: parentId,
          user: {
            schoolId,
          },
        },
      });
      return parent;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  findByUserId = async (params: { userId: string; schoolId: string }, tx?: TX) => {
    const { userId, schoolId } = params;
    const client = tx ?? prisma;
    try {
      const parent = await client.parent.findUnique({
        where: {
          id: userId,
        },
      });
      return parent;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };
}
