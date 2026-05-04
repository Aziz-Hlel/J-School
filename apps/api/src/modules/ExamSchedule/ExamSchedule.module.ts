import { createExamScheduleRouter } from './ExamSchedul.route';
import { ExamScheduleController } from './ExamSchedule.controller';
import { ExamScheduleService } from './ExamSchedule.service';

export const ExamScheduleModule = () => {
  const examScheduleService = new ExamScheduleService();
  const examScheduleController = new ExamScheduleController(examScheduleService);
  const examScheduleRouter = createExamScheduleRouter(examScheduleController);
  return { examScheduleRouter };
};
