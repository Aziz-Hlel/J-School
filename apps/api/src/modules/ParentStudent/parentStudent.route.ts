import { Router } from 'express';
import { ParentStudentController } from './parentStudent.controller';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { asyncHandler } from '@/core/async-handler';
import requireUserPermission from '@/middleware/requirePermission.middleware';
import { UserRole } from '@repo/db/prisma/enums';

export const createRouter = (parentStudentController: ParentStudentController) => {
  const router = Router({ mergeParams: true });
  router.post(
    '/',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(parentStudentController.assignStudentToParent),
  );
  router.delete(
    '/',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(parentStudentController.unassignStudentFromParent),
  );
  return router;
};
