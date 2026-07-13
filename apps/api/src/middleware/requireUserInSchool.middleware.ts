import { ConflictError } from '@/err/service/customErrors';
import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import getUrlParam from '@/utils/getUrlParam';
import prisma from '@repo/db';
import { AccountRole } from '@repo/db/prisma/enums';
import { NextFunction, Request, Response } from 'express';

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

  if (user) return next();

  const isOwner = await prisma.school.findUnique({
    where: {
      id: schoolId,
      owner: {
        accountId,
      },
    },
    select: { id: true },
  });

  if (isOwner) return next();

  throw new ConflictError({
    message: 'User not authorized',
    internalLog: `Account with id ${accountId} does not exist in school with id ${schoolId}`,
  });
};

export default requireUserInSchool;
