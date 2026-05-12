import { Router } from 'express';
import { FeesController } from './fees.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireUserRoles from '@/middleware/requirePermission.middleware';
import { UserRole } from '@repo/db/prisma/enums';

export const createRouter = (controller: FeesController) => {
  const router = Router({ mergeParams: true });
  router.post(
    '/',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.create),
  );

  router.get('/:feeId', requireAuth, asyncHandler(controller.findById));

  router.put(
    '/:feeId',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.update),
  );

  router.delete(
    '/:feeId',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.delete),
  );

  return router;
};
