import { TeacherController } from './teacher.controller';
import { TeacherRepo } from './teacher.repo';
import { createRouter } from './teacher.route';
import { TeacherService } from './teacher.service';
import { UserService } from '../User/user.service';
import { CreateTeacherUseCase } from './use-cases/createTeacher.use-case';
import { CreateSimpleUserUseCase } from '../User/use-cases/createSimpleUser.use-case';

export const TeacherModule = (params: {
  userService: UserService;
  createSimpleUserUseCase: CreateSimpleUserUseCase;
}) => {
  const { userService, createSimpleUserUseCase } = params;
  const repo = new TeacherRepo();
  const service = new TeacherService(repo, userService);
  const createTeacherUseCase = new CreateTeacherUseCase(service, createSimpleUserUseCase);
  const controller = new TeacherController(service, createTeacherUseCase);
  const teacherRouter = createRouter(controller);
  return { teacherRouter };
};
