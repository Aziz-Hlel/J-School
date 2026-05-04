import { ClassroomTimetableController } from './classroomTimetable.controller';
import { createClassroomTimetableRouter } from './classroomtimetable.route';
import { ClassroomTimetableService } from './classroomTimetable.service';
import { TimetableRepo } from './timetable.repo';

export const ClassroomTimetableModule = () => {
  const repo = new TimetableRepo();
  const classroomTimetableService = new ClassroomTimetableService(repo);
  const classroomTimetableController = new ClassroomTimetableController(classroomTimetableService);
  const classroomTimetableRouter = createClassroomTimetableRouter(classroomTimetableController);
  return { classroomTimetableRouter };
};
