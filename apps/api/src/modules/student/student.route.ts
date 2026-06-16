import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireUserRoles from '@/middleware/requirePermission.middleware';
import { UserRole } from '@repo/db/prisma/enums';
import { Router } from 'express';
import { StudentController } from './student.controller';

export const createRouter = (studentController: StudentController) => {
  const router = Router({ mergeParams: true });
  router.use(requireAuth);

  router.post('/', asyncHandler(studentController.create));

  router.post(
    '/with-parent',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(studentController.createWithParent),
  );

  router.put('/:studentId', requireAuth, asyncHandler(studentController.update));

  router.get('/', requireAuth, asyncHandler(studentController.findAll));

  router.get('/:studentId/attendances', requireAuth, asyncHandler(studentController.getAttendances));

  router.get('/:studentId/attendances/weekly', requireAuth, asyncHandler(studentController.getWeeklyAttendances));

  router.get('/:studentId/fees', requireAuth, asyncHandler(studentController.findFees));

  router.get('/:studentId/extra-curriculars', requireAuth, asyncHandler(studentController.getExtraCurricular));

  router.get('/:studentId/teacher-comments', requireAuth, asyncHandler(studentController.findTeacherComments));

  router.get('/:studentId/homework', requireAuth, asyncHandler(studentController.findHomework));

  router.get('/:studentId', requireAuth, asyncHandler(studentController.findById));

  return router;
};
