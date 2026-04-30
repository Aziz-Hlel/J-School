import { asyncHandler } from '@/core/async-handler';
import { UserRole } from '@repo/db/prisma/enums';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { Router } from 'express';
import { requireUserPermissionOrIsParentChild } from './middleware/requireUserPermissionOrIsParentChild';
import { StudentController } from './student.controller';
import requireUserPermission from '@/middleware/requirePermission.middleware';

export const createRouter = (studentController: StudentController) => {
  const router = Router({ mergeParams: true });

  router.post('/', requireAuth, asyncHandler(studentController.create));

  router.post(
    '/with-parent',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(studentController.createWithParent),
  );

  router.put(
    '/:studentId',
    requireAuth,
    requireUserPermissionOrIsParentChild([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(studentController.update),
  );

  router.get(
    '/:studentId',
    requireAuth,
    requireUserPermissionOrIsParentChild([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(studentController.findById),
  );

  return router;
};
