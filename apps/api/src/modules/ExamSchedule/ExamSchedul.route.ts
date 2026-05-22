import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireUserRoles from '@/middleware/requirePermission.middleware';
import { UserRole } from '@repo/db/prisma/enums';
import { Router } from 'express';
import { ExamScheduleController } from './ExamSchedule.controller';

export const createExamScheduleRouter = (examScheduleController: ExamScheduleController) => {
  const router = Router({ mergeParams: true });
  router.put(
    '/',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(examScheduleController.update),
  );
  router.get('/classrooms/:classroomId', requireAuth, asyncHandler(examScheduleController.findByClassroom));
  return router;
};
