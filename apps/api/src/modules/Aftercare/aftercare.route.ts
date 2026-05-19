import { Router } from 'express';
import { AftercareController } from './aftercare.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';

export const createRouter = (controller: AftercareController) => {
  const router = Router({ mergeParams: true });
  router.post('/', requireAuth, asyncHandler(controller.sync));
  router.get('/', requireAuth, asyncHandler(controller.findByDate));
  return router;
};
