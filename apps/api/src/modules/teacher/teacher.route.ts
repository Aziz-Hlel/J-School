import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireUserRoles from '@/middleware/requirePermission.middleware';
import { UserRole } from '@repo/db/prisma/enums';
import { Router } from 'express';
import { requireUserPermissionOrTeacherHimself } from './middleware/requireUserPermissionOrTeacherHimself';
import { TeacherController } from './teacher.controller';

export const createRouter = (teacherController: TeacherController) => {
  const router = Router({ mergeParams: true });

  router.post(
    '/',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(teacherController.create),
  );

  router.put(
    '/:teacherId',
    requireAuth,
    requireUserPermissionOrTeacherHimself([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(teacherController.update),
  );

  router.get(
    '/',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(teacherController.findAll),
  );

  // * removed requireUserPermissionOrTeacherHimself just cause ... fck it, no time to be pondering about it
  router.get('/:teacherId/timetable', requireAuth, asyncHandler(teacherController.getTimetable));

  router.get('/:teacherId/timetable/weekly', requireAuth, asyncHandler(teacherController.getFullTimeTable));

  router.get(
    '/:teacherId/extra-curriculars',
    requireAuth,
    asyncHandler(teacherController.getExtraCurricularWithSession),
  );

  router.get('/:teacherId/classrooms', requireAuth, asyncHandler(teacherController.getClassrooms));

  router.get('/:teacherId/assignments', requireAuth, asyncHandler(teacherController.getAssignments));

  router.get('/:teacherId/exam-schedules', requireAuth, asyncHandler(teacherController.getExamSchedule));

  router.get('/:teacherId/comments', requireAuth, asyncHandler(teacherController.getMyComments));

  router.get(
    '/:teacherId/homeworks',
    requireAuth,
    requireUserPermissionOrTeacherHimself([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(teacherController.getHomeworks),
  );

  router.get(
    '/:teacherId',
    requireAuth,
    requireUserPermissionOrTeacherHimself([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(teacherController.findById),
  );

  return router;
};
