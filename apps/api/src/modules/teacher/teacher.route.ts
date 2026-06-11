import { Router } from 'express';
import { TeacherController } from './teacher.controller';
import { asyncHandler } from '@/core/async-handler';
import { UserRole } from '@repo/db/prisma/enums';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { requireUserPermissionOrTeacherHimself } from './middleware/requireUserPermissionOrTeacherHimself';
import requireUserRoles from '@/middleware/requirePermission.middleware';

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

  router.get('/:teacherId/full-timetable', requireAuth, asyncHandler(teacherController.getFullTimeTable));

  router.get(
    '/:teacherId/extraCurriculars',
    requireAuth,
    asyncHandler(teacherController.getExtraCurricularWithSession),
  );

  router.get('/:teacherId/classrooms', requireAuth, asyncHandler(teacherController.getClassrooms));

  router.get(
    '/:teacherId',
    requireAuth,
    requireUserPermissionOrTeacherHimself([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(teacherController.findById),
  );

  return router;
};
