import { Router } from 'express';
import { StaffController } from './staff.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireUserPermission from '@/middleware/requirePermission.middleware';
import { UserRole } from '@repo/db/prisma/enums';

export const createRoute = (staffController: StaffController) => {
  const router = Router({ mergeParams: true });

  router.post(
    '/',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(staffController.create),
  );

  router.put(
    '/:staffId',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(staffController.update),
  );

  router.get(
    '/',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(staffController.findAll),
  );

  router.get(
    '/:staffId',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(staffController.getById),
  );

  return router;
};
