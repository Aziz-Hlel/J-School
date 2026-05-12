import { Router } from 'express';
import { FeesController } from './fees.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';

export const createRouter = (controller: FeesController) => {
  const router = Router({ mergeParams: true });
  router.post('/', requireAuth, asyncHandler(controller.create));
  router.put('/:feesId', requireAuth, asyncHandler(controller.update));
  router.delete('/:feesId', requireAuth, asyncHandler(controller.delete));
  router.get('/:feesId', requireAuth, asyncHandler(controller.findById));
  return router;
};
