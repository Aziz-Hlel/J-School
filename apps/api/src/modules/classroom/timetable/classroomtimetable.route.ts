import { Router } from 'express';
import { ClassroomTimetableController as ClassroomTimetableController } from './classroomTimetable.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';

export const createClassroomTimetableRouter = (classroomTimetableController: ClassroomTimetableController) => {
  const router = Router({ mergeParams: true });
  router.get('/weekly', requireAuth, asyncHandler(classroomTimetableController.findAll));
  router.post('/', requireAuth, asyncHandler(classroomTimetableController.create));
  router.put('/:timetableId', requireAuth, asyncHandler(classroomTimetableController.update));
  router.delete('/:timetableId', requireAuth, asyncHandler(classroomTimetableController.delete));

  return router;
};
