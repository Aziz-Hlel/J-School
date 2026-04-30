import { UserRoleSimple } from '@repo/contracts/types/enums/meta/userRoleMeta';
import { UserRoleRepo } from './userRole.repo';
import { prisma } from '@/bootstrap/db.init';
import { ConflictError } from '@/err/service/customErrors';
import { UserRole } from '@repo/db/prisma/enums';
import { RepoKnownErrors } from '@/err/repo/DbError';
import { Prisma } from '@repo/db/prisma/client';
import { PrismaErrorCode } from '@/err/repo/PrismaErrorCode';
import { TX } from '@/types/prisma/PrismaTransaction';

export class UserRoleService {
  constructor(private readonly userRoleRepo: UserRoleRepo) {}

  grantSimpleRole = async ({ userId, role }: { userId: string; role: UserRoleSimple }) => {
    const existingRole = await this.userRoleRepo.findByUserIdAndRole({ userId, role });
    if (existingRole) {
      return { role: existingRole, type: 'EXISTING' } as const;
    }
    const createdUserRole = await this.userRoleRepo.grantSimpleRole({ userId, role });
    return { role: createdUserRole, type: 'NEW' } as const;
  };

  revokeSimpleRole = async ({ userId, role }: { userId: string; role: UserRoleSimple }) => {
    const existingRole = await this.userRoleRepo.findByUserIdAndRole({ userId, role });
    if (!existingRole) {
      return { role: null, type: 'NOT_FOUND' } as const;
    }
    const userRolesCount = await prisma.userRoles.count({
      where: {
        userId,
      },
    });
    if (userRolesCount === 1) {
      throw new ConflictError("You can't delete the last role");
    }
    const deletedUserRole = await this.userRoleRepo.revokeSimpleRole({ userId, role });
    return { role: deletedUserRole, type: 'DELETED' } as const;
  };

  grantRole_V2 = async ({ userId, role }: { userId: string; role: UserRole }, tx?: TX) => {
    try {
      const createdUserRole = await this.userRoleRepo.grantRole_V2({ userId, role }, tx);
      return { role: createdUserRole, type: 'NEW' } as const;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // * this is to make the api idempotent , so if the user already has the role , it will return the existing role
        // * but at the same type if i m going to do the "GO fail" strategy , i should do it accross all the project
        // * so do i just throw the error, and based on what i want to do , if it s an api i would catch it and send a 200
        // * or if it s a worker , i would let it fail and retry
        if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT) {
          return { role: null, type: 'EXISTING' } as const;
        }
      }
      throw error;
    }
  };

  revokeRole_V2 = async ({ userId, role }: { userId: string; role: UserRole }, tx?: TX) => {
    try {
      const deletedUserRole = await this.userRoleRepo.revokeRole_V2({ userId, role }, tx);
      return { role: deletedUserRole, type: 'DELETED' } as const;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.NOT_FOUND) {
          return { role: null, type: 'NOT_FOUND' } as const;
        }
      }
      throw error;
    }
  };

  findByUserIdAndRole = async ({ userId, role }: { userId: string; role: UserRoleSimple }) => {
    const userRole = await this.userRoleRepo.findByUserIdAndRole({ userId, role });
    return userRole;
  };

  findManyById = async ({ id }: { id: string }) => {
    const userRole = await this.userRoleRepo.findManyById({ id });
    return userRole;
  };
}
