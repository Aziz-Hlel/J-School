import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { UserRole } from '@repo/db/prisma/browser';
import { Router } from 'express';
import { requireUserPermissionOrIsParentChild } from '../student/middleware/requireUserPermissionOrIsParentChild';
import { ParentController } from './parent.controller';

const createParentRouter = (controller: ParentController) => {
  const router = Router({ mergeParams: true });

  router.post(
    '/',
    requireAuth,
    requireUserPermissionOrIsParentChild([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.create),
  );

  router.get(
    '/',
    requireAuth,
    requireUserPermissionOrIsParentChild([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.findAll),
  );

  router.get(
    '/:parentId',
    requireAuth,
    requireUserPermissionOrIsParentChild([UserRole.DIRECTOR, UserRole.MANAGER, UserRole.PARENT]),
    asyncHandler(controller.findById),
  );

  router.put(
    '/:parentId',
    requireAuth,
    requireUserPermissionOrIsParentChild([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.update),
  );

  return router;
};

export default createParentRouter;
