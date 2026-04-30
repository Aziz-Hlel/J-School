import { AssignmentController } from './assignment.controller';
import { AssignmentRepo } from './assignment.repo';
import { createRouter } from './assignment.route';
import { AssignmentService } from './assignment.service';
import { AssignmentInternal } from './assignment.internal';

export const AssignmentModule = () => {
  const assignmentRepo = new AssignmentRepo();
  const assignmentInternal = new AssignmentInternal(assignmentRepo);
  const assignmentService = new AssignmentService(assignmentRepo);
  const assignmentController = new AssignmentController(assignmentService);
  const assignmentRouter = createRouter(assignmentController);
  return { assignmentService, assignmentInternal, assignmentRouter };
};
