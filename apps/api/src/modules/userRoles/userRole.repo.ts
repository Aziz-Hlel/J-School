import { prisma } from '@/bootstrap/db.init';
import { RepoError } from '@/err/repo/DbError';
import { RepoError_V2 } from '@/err/repo/DbError.v2';
import { UserRole } from '@repo/db/prisma/client';
import { TX } from '@/types/prisma/PrismaTransaction';
import { UserRoleSimple } from '@repo/contracts/types/enums/meta/userRoleMeta';

export class UserRoleRepo {
  grantSimpleRole = async ({ userId, role }: { userId: string; role: UserRoleSimple }) => {
    try {
      const userRole = await prisma.userRoles.create({
        data: {
          userId,
          role,
        },
      });
      return userRole;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  revokeSimpleRole = async ({ userId, role }: { userId: string; role: UserRoleSimple }) => {
    try {
      const userRole = await prisma.userRoles.delete({
        where: {
          userId_role: {
            userId,
            role,
          },
        },
      });
      return userRole;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  grantRole_V2 = async ({ userId, role }: { userId: string; role: UserRole }, tx?: TX) => {
    const client = tx || prisma;
    const userRole = await client.userRoles.upsert({
      where: {
        userId_role: {
          userId,
          role,
        },
      },
      update: {},
      create: {
        userId,
        role,
      },
    });
    return userRole;
  };

  revokeRole_V2 = async ({ userId, role }: { userId: string; role: UserRole }, tx?: TX) => {
    const client = tx || prisma;
    const userRole = await client.userRoles.delete({
      where: {
        userId_role: {
          userId,
          role,
        },
      },
    });
    return userRole;
  };

  findByUserIdAndRole_V2 = async ({ userId, role }: { userId: string; role: UserRole }) => {
    try {
      const userRole = await prisma.userRoles.findUnique({
        where: {
          userId_role: {
            userId,
            role,
          },
        },
      });
      return userRole;
    } catch (error) {
      RepoError_V2.handleRepoError(error);
    }
  };

  findByUserIdAndRole = async ({ userId, role }: { userId: string; role: UserRoleSimple }) => {
    try {
      const userRole = await prisma.userRoles.findUnique({
        where: {
          userId_role: {
            userId,
            role,
          },
        },
      });
      return userRole;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  findManyById = async ({ id }: { id: string }) => {
    try {
      return await prisma.userRoles.findMany({
        where: {
          id,
        },
      });
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };
}
