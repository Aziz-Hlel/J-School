import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireUserRoles from '@/middleware/requirePermission.middleware';
import { UserRole } from '@repo/db/prisma/enums';
import { Router } from 'express';
import { AttendanceController } from './attendance.controller';

export const createRouter = (controller: AttendanceController) => {
  const router = Router({ mergeParams: true });

  // * missing a validation if the teacher assigned to the assignment to which the session belongs to
  router.post('/', requireAuth, requireUserRoles([UserRole.TEACHER]), asyncHandler(controller.sync));
  return router;
};
