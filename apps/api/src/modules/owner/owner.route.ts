import { asyncHandler } from '@/core/async-handler';
import { Router } from 'express';
import { OwnerController } from './owner.controller';
import requireRole from '@/middleware/requireRole.middleware';
import { AccountRole } from '@repo/db/prisma/enums';
import { requireAuth } from '@/middleware/requireAuth.middleware';

export const createRouter = (controller: OwnerController) => {
  const router = Router();
  router.post('/', requireAuth, requireRole(AccountRole.ADMIN), asyncHandler(controller.create));
  return router;
};
