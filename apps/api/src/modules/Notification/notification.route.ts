import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';

export const createRouter = (controller: NotificationController) => {
  const router = Router({ mergeParams: true });
  router.post('/', requireAuth, asyncHandler(controller.create));
  router.put('/:notificationId', requireAuth, asyncHandler(controller.update));
  router.delete('/:notificationId', requireAuth, asyncHandler(controller.delete));
  router.get('/:notificationId', requireAuth, asyncHandler(controller.findById));
  return router;
};
