import { Router } from 'express';
import { ExtraCurricularController } from './ExtraCurricular.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireUserPermission from '@/middleware/requirePermission.middleware';
import { UserRole } from '@repo/db/prisma/enums';

export const createRouter = (controller: ExtraCurricularController) => {
  const router = Router();
  router.post(
    '/',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.create),
  );
  router.put(
    '/:extraCurricularId',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.update),
  );
  router.delete(
    '/:extraCurricularId',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.delete),
  );
  return router;
};
