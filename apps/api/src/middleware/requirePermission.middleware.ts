import { prisma } from '@/bootstrap/db.init';
import { ConflictError } from '@/err/service/customErrors';
import { AccountRole, UserRole } from '@repo/db/prisma/enums';
import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import getUrlParam from '@/utils/getUrlParam';
import { NextFunction, Request, Response } from 'express';

const requireUserPermission = (requiredRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = (req as AuthenticatedRequest).token;
    if (token.claims.accountRole === AccountRole.SUPER_ADMIN) {
      return next();
    }

    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const accountId = token.claims.accountId;

    const school = await prisma.school.findFirst({
      where: {
        id: schoolId,
        OR: [
          // Is this account the owner?
          { owner: { accountId } },
          // Or does this account have a user with the right role in this school?
          {
            users: {
              some: {
                accountId,
                roles: { some: { role: { in: requiredRoles } } },
              },
            },
          },
        ],
      },
    });

    if (!school) {
      throw new ConflictError({
        message: 'User not authorized',
        internalLog: `Account with id ${accountId} does not have required roles ${requiredRoles.join(', ')} for school with id ${schoolId}`,
      });
    }

    return next();
  };
};

export default requireUserPermission;
