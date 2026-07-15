import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireUserRoles from '@/middleware/requirePermission.middleware';
import { UserRole } from '@repo/db/prisma/enums';
import { Router } from 'express';
import { UserController } from './user.controller';

const createUserRouter = (controller: UserController) => {
  const router = Router({ mergeParams: true });

  router.post(
    '/',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.create),
  );
  router.get('/:userId/roles', requireAuth, asyncHandler(controller.getUserRoles));
  router.get('/:userId', requireAuth, asyncHandler(controller.getById));

  router.put('/:userId/roles', requireAuth, asyncHandler(controller.updateUserRoles));
  router.put('/:userId', requireAuth, asyncHandler(controller.update));

  router.patch(
    '/:userId/password',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.updatePassword),
  );

  router.delete(
    '/:userId',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.deleteUser),
  );

  return router;
};

export default createUserRouter;
