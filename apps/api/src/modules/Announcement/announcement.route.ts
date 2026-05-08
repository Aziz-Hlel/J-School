import { Router } from 'express';
import { AnnouncementController } from './announcement.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireUserRoles from '@/middleware/requirePermission.middleware';
import { UserRole } from '@repo/db/prisma/enums';

export const createRouter = (controller: AnnouncementController) => {
  const router = Router({ mergeParams: true });

  router.post(
    '/',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.create),
  );

  router.post('/:announcementId/reactions', requireAuth, asyncHandler(controller.syncReaction));

  router.put(
    '/:announcementId',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.update),
  );

  router.delete(
    '/:announcementId',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.delete),
  );

  router.get('/', requireAuth, asyncHandler(controller.find));

  return router;
};
