import { NextFunction, Request, Response } from 'express';
import { AccountRole } from '@repo/db/prisma/enums';
import getUrlParam from '@/utils/getUrlParam';
import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import { ConflictError } from '@/err/service/customErrors';
import prisma from '@repo/db';

const requireUserInSchool = async (req: Request, _: Response, next: NextFunction) => {
  const token = (req as AuthenticatedRequest).token;
  if (token.claims.accountRole === AccountRole.SUPER_ADMIN) {
    return next();
  }

  const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
  const accountId = token.claims.accountId;

  const user = await prisma.user.findUnique({
    where: {
      accountId_schoolId: { accountId, schoolId },
    },
    select: { id: true },
  });

  if (!user) {
    throw new ConflictError({
      message: 'User not authorized',
      internalLog: `Account with id ${accountId} does not exist in school with id ${schoolId}`,
    });
  }

  return next();
};

export default requireUserInSchool;
