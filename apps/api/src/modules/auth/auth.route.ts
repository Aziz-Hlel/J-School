import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { Router } from 'express';
import { AuthController } from './auth.controller';

const createRouter = (controller: AuthController) => {
  const router = Router();

  router.post('/password', asyncHandler(controller.authWithPassword));
  router.post('/provider', asyncHandler(controller.authWithProvider));
  router.get('/me', requireAuth, asyncHandler(controller.me));

  return router;
};

export default createRouter;
