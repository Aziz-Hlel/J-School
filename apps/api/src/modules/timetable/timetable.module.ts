import { TimetableController } from './timetable.controller';
import { TimetableRepo } from './timetable.repo';
import { TimetableService } from './timetable.service';
import { createRouter } from './timetable.route';

export const TimeTableModule = () => {
  const repo = new TimetableRepo();
  const service = new TimetableService(repo);
  const controller = new TimetableController(service);
  const timetableRouter = createRouter(controller);
  return { timetableRouter };
};
