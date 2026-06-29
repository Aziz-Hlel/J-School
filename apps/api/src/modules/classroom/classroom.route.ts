import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireUserRoles from '@/middleware/requirePermission.middleware';
import { UserRole } from '@repo/db/prisma/enums';
import { Router } from 'express';
import { ClassroomController } from './classroom.controller';

export const createRouter = (classController: ClassroomController) => {
  const router = Router({ mergeParams: true });

  router.post(
    '/',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(classController.create),
  );

  router.get(
    '/',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(classController.findAll),
  );

  router.get(
    '/with-students',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(classController.findAllWithStudents),
  );

  router.get('/:classroomId', requireAuth, asyncHandler(classController.findById));

  router.put(
    '/:classroomId',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(classController.update),
  );

  return router;
};
