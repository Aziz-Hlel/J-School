import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { Router } from 'express';
import { UserRoleController } from './userRole.controller';
import requireUserPermission from '@/middleware/requirePermission.middleware';
import { UserRole } from '@repo/db/prisma/enums';

export const createRouter = (controller: UserRoleController) => {
  const router = Router({ mergeParams: true });
  router.post(
    '/',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.assignRoleToUser),
  );
  router.delete(
    '/',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.revokeRoleFromUser),
  );
  return router;
};
