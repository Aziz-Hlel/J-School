import { Router } from 'express';
import { asyncHandler } from '../../core/async-handler';
import { requireAuth } from '../../middleware/requireAuth.middleware';
import { RootController } from './root.controller';
import ENV from '@/config/env';

export const createRouter = (controller: RootController) => {
  const router = Router();

  router.get('/health', asyncHandler(controller.getHealth));
  router.get('/healthz', requireAuth, asyncHandler(controller.getHealthz));
  if (ENV.NODE_ENV === 'dev') router.delete('/hard-reset', asyncHandler(controller.hardReset));

  return router;
};
