import { ParentStudentRepo } from './parentStudent.repo';
import { ParentStudentService } from './parentStudent.service';
import { ParentStudentController } from './parentStudent.controller';
import { createRouter } from './parentStudent.route';

export const parentStudentModule = () => {
  const parentStudentRepo = new ParentStudentRepo();
  const parentStudentService = new ParentStudentService(parentStudentRepo);
  const parentStudentController = new ParentStudentController(parentStudentService);
  const parentStudentRouter = createRouter(parentStudentController);
  return { parentStudentRouter, parentStudentService, parentStudentRepo };
};
