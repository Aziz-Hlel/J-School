import { Router } from 'express';
import { TeacherController } from './teacher.controller';
import { asyncHandler } from '@/core/async-handler';
import { UserRole } from '@repo/db/prisma/enums';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { requireUserPermissionOrTeacherHimself } from './middleware/requireUserPermissionOrTeacherHimself';
import requireUserPermission from '@/middleware/requirePermission.middleware';

export const createRouter = (teacherController: TeacherController) => {
  const router = Router({ mergeParams: true });

  router.post(
    '/',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(teacherController.create),
  );

  router.put(
    '/:teacherId',
    requireAuth,
    requireUserPermissionOrTeacherHimself([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(teacherController.update),
  );

  router.get(
    '/',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(teacherController.findAll),
  );

  router.get(
    '/:teacherId',
    requireAuth,
    requireUserPermissionOrTeacherHimself([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(teacherController.findById),
  );

  return router;
};
