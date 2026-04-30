import { Router } from 'express';
import { StudentProfileController } from './studentProfile.controller';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { requireUserPermissionOrIsParentChild } from '../student/middleware/requireUserPermissionOrIsParentChild';
import { UserRole } from '@repo/db/prisma/enums';
import { asyncHandler } from '@/core/async-handler';

export const createRouter = (studentProfileController: StudentProfileController) => {
  const router = Router({ mergeParams: true });

  router.post(
    '/',
    requireAuth,
    requireUserPermissionOrIsParentChild([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(studentProfileController.create),
  );

  router.put(
    '/',
    requireAuth,
    requireUserPermissionOrIsParentChild([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(studentProfileController.update),
  );

  router.get(
    '/',
    requireAuth,
    requireUserPermissionOrIsParentChild([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(studentProfileController.getById),
  );

  return router;
};
