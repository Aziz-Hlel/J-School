import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireRole from '@/middleware/requireRole.middleware';
import { AccountRole } from '@repo/db/prisma/enums';
import { Router } from 'express';
import { SchoolController } from './school.controller';

export const createSchoolRoute = (controller: SchoolController) => {
  const router = Router();
  router.post('/', requireAuth, requireRole(AccountRole.ADMIN), asyncHandler(controller.create));

  router.get('/', requireAuth, requireRole(AccountRole.ADMIN), asyncHandler(controller.getPage));
  router.get('/me', requireAuth, requireRole(AccountRole.ADMIN), asyncHandler(controller.getMySchool));
  router.get('/:schoolId', requireAuth, requireRole(AccountRole.ADMIN), asyncHandler(controller.getById));

  router.put('/:schoolId', requireAuth, requireRole(AccountRole.ADMIN), asyncHandler(controller.update));

  router.delete('/:schoolId', requireAuth, requireRole(AccountRole.ADMIN), asyncHandler(controller.delete));

  router.get(
    '/:schoolId/classrooms/select',
    requireAuth,
    requireRole(AccountRole.ADMIN),
    asyncHandler(controller.selectClassrooms),
  );

  return router;
};
