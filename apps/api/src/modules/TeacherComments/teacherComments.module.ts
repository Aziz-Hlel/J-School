import { TeacherCommentsController } from './teacherComments.controller';
import { createRouter } from './teacherComments.route';
import { TeacherCommentsService } from './teacherComments.service';

export const TeacherCommentsModule = () => {
  const service = new TeacherCommentsService();
  const controller = new TeacherCommentsController(service);
  const teacherCommentsRouter = createRouter(controller);
  return {
    teacherCommentsRouter,
  };
};
