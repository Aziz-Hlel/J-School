import { Router } from 'express';
import { ExamScheduleController } from './ExamSchedule.controller';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { asyncHandler } from '@/core/async-handler';
import requireUserRoles from '@/middleware/requirePermission.middleware';
import { UserRole } from '@repo/db/prisma/enums';

export const createExamScheduleRouter = (examScheduleController: ExamScheduleController) => {
  const router = Router({ mergeParams: true });
  router.put(
    '/',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(examScheduleController.update),
  );
  return router;
};
