import { asyncHandler } from '@/core/async-handler';
import { Router } from 'express';
import { AccountController } from './account.controller';

const createRouter = (controller: AccountController) => {
  const router = Router();
  router.post('/admin', asyncHandler(controller.createAdminWithPassword));
  return router;
};

export default createRouter;
