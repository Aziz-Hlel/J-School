import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { Router } from 'express';
import { NotificationController } from './notification.controller';

export const createRouter = (controller: NotificationController) => {
  const router = Router({ mergeParams: true });
  router.get('/', requireAuth, asyncHandler(controller.find));
  router.get('/count', requireAuth, asyncHandler(controller.getCount));
  return router;
};
