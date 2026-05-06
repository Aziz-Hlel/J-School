import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { Router } from 'express';
import { UserController } from './user.controller';
import { UserRole } from '@repo/db/prisma/enums';
import requireUserRoles from '@/middleware/requirePermission.middleware';

const createUserRouter = (controller: UserController) => {
  const router = Router({ mergeParams: true });

  router.post(
    '/',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.create),
  );
  router.get(
    '/:userId',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER, UserRole.TEACHER]),
    asyncHandler(controller.getById),
  );

  return router;
};

export default createUserRouter;
