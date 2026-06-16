import { Router } from 'express';
import { MobileController } from './mobile.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';

export const createRouter = (controller: MobileController) => {
  const router = Router({ mergeParams: true });
  router.post('/', requireAuth, asyncHandler(controller.create));
  router.put('/:mobileId', requireAuth, asyncHandler(controller.update));
  router.delete('/:mobileId', requireAuth, asyncHandler(controller.delete));
  router.get('/:mobileId', requireAuth, asyncHandler(controller.findById));
  return router;
};
