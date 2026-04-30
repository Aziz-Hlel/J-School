import { asyncHandler } from '@/core/async-handler';
import { UserRole } from '@repo/db/prisma/enums';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireUserPermission from '@/middleware/requirePermission.middleware';
import { Router } from 'express';
import { TimetableController } from './timetable.controller';

export const createRouter = (timetableController: TimetableController) => {
  const router = Router({ mergeParams: true });
  router.post(
    '/',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(timetableController.create),
  );
  router.put(
    '/:timetableId',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(timetableController.update),
  );
  router.delete(
    '/:timetableId',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(timetableController.delete),
  );
  return router;
};
