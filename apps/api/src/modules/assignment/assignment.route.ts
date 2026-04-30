import { Router } from 'express';
import { AssignmentController } from './assignment.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireUserPermission from '@/middleware/requirePermission.middleware';
import { UserRole } from '@repo/db/prisma/enums';

export const createRouter = (assignmentController: AssignmentController) => {
  const router = Router({ mergeParams: true });

  // router.post(
  //   '/sync',
  //   requireAuth,
  //   requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
  //   asyncHandler(assignmentController.syncMany),
  // );

  router.patch(
    '/:assignmentId/teacher',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(assignmentController.assignTeacher),
  );

  router.get('/timetable', requireAuth, asyncHandler(assignmentController.getClassroomTimeTable));

  return router;
};
