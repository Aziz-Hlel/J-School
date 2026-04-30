import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { Router } from 'express';
import { UserController } from './user.controller';
import { UserRole } from '@repo/db/prisma/enums';
import requireUserPermission from '@/middleware/requirePermission.middleware';

const createUserRouter = (controller: UserController) => {
  const router = Router({ mergeParams: true });

  router.post(
    '/',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.create),
  );
  router.get(
    '/:userId',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER, UserRole.TEACHER]),
    asyncHandler(controller.getById),
  );

  return router;
};

export default createUserRouter;
