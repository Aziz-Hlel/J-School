import { Router } from 'express';
import type { ClassroomManagementController } from './ClassroomManagement.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireUserInSchool from '@/middleware/requireUserInSchool.middleware';

export const createClassroomManagementRouter = (controller: ClassroomManagementController) => {
  const router = Router({ mergeParams: true });

  router.get('/subjects', requireAuth, requireUserInSchool, controller.getSubjectsWithTeachers);

  router.get('/exams', requireAuth, requireUserInSchool, asyncHandler(controller.getExams));

  router.get('/attendances', requireAuth, requireUserInSchool, asyncHandler(controller.getAttendances));

  router.get('/students', requireAuth, requireUserInSchool, asyncHandler(controller.getStudents));

  // ? Bullshit
  router.post('/assign-teacher', requireAuth, requireUserInSchool, asyncHandler(controller.assignTeacher));

  // * removed to support null assigned classrooms
  // router.post('/assign-student', requireAuth, requireUserInSchool, asyncHandler(controller.assignStudent));

  return router;
};
