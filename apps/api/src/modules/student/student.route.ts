import { asyncHandler } from '@/core/async-handler';
import { UserRole } from '@repo/db/prisma/enums';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { Router } from 'express';
import { requireUserPermissionOrIsParentChild } from './middleware/requireUserPermissionOrIsParentChild';
import { StudentController } from './student.controller';
import requireUserRoles from '@/middleware/requirePermission.middleware';

export const createRouter = (studentController: StudentController) => {
  const router = Router({ mergeParams: true });
  router.use(requireAuth);

  router.post('/', asyncHandler(studentController.create));

  router.post(
    '/with-parent',
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(studentController.createWithParent),
  );

  router.put(
    '/:studentId',
    requireUserPermissionOrIsParentChild([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(studentController.update),
  );

  router.get(
    '/',
    requireUserPermissionOrIsParentChild([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(studentController.findAll),
  );

  router.get(
    '/:studentId/attendances',
    requireUserPermissionOrIsParentChild([UserRole.DIRECTOR, UserRole.MANAGER, UserRole.TEACHER]),
    asyncHandler(studentController.getAttendances),
  );

  router.get(
    '/:studentId/extra-curriculars',
    requireUserPermissionOrIsParentChild([UserRole.DIRECTOR, UserRole.MANAGER, UserRole.TEACHER]),
    asyncHandler(studentController.getExtraCurricular),
  );

  router.get(
    '/:studentId',
    requireUserPermissionOrIsParentChild([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(studentController.findById),
  );

  return router;
};
