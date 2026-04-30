import { Router } from 'express';
import { AccountController } from './account.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';

const createRouter = (controller: AccountController) => {
  const router = Router();
  router.post('/admin', asyncHandler(controller.createAdminWithPassword));
  return router;
};

export default createRouter;
