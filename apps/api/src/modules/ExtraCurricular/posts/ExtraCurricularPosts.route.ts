import { Router } from 'express';
import { ExtraCurricularPostsController } from './ExtraCurricularPosts.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireUserRoles from '@/middleware/requirePermission.middleware';
import { UserRole } from '@repo/db/prisma/enums';

export const createExtraCurricularPostsRouter = (controller: ExtraCurricularPostsController) => {
  const router = Router({ mergeParams: true });

  router.post(
    '/',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER, UserRole.TEACHER]),
    asyncHandler(controller.create),
  );

  router.put(
    '/:postId',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER, UserRole.TEACHER]),
    asyncHandler(controller.update),
  );

  router.delete(
    '/:postId',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER, UserRole.TEACHER]),
    asyncHandler(controller.delete),
  );

  router.get('/', requireAuth, asyncHandler(controller.findAll));

  return router;
};
