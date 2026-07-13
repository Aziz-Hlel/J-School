import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireUserRoles from '@/middleware/requirePermission.middleware';
import { UserRole } from '@repo/db/prisma/enums';
import { Router } from 'express';
import { SubjectController } from './subject.controller';

export const createRouter = (subjectController: SubjectController) => {
  const router = Router({ mergeParams: true });
  // router.post(
  //   '/',
  //   requireAuth,
  //   requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
  //   asyncHandler(subjectController.create),
  // );

  // router.post(
  //   '/bulk',
  //   requireAuth,
  //   requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
  //   asyncHandler(subjectController.createMany),
  // );

  router.post(
    '/bulk',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(subjectController.createWithExams),
  );

  router.put(
    '/:subjectId',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(subjectController.update),
  );

  router.get('/:subjectId', requireAuth, asyncHandler(subjectController.find));
  router.get(
    '/',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(subjectController.findAll),
  );

  return router;
};
