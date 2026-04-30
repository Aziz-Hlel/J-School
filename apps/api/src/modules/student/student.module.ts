import { StudentController } from './student.controller';
import { StudentRepo } from './student.repo';
import { createRouter } from './student.route';
import { StudentService } from './student.service';
import { CreateStudentWithParentUseCase } from './use-case/createStudentWithParent';
import { UserRepo } from '../User/user.repo';
import { ParentStudentService } from '../ParentStudent/parentStudent.service';
import { CreateSimpleUserUseCase } from '../User/use-cases/createSimpleUser.use-case';
import { ParentService } from '../parent/parent.service';
import { UserRoleService } from '../userRoles/userRole.service';
import { ParentRepo } from '../parent/parent.repo';

export const StudentModule = ({
  userRepo,
  parentRepo,
  parentStudentService,
  userRoleService,
  parentService,
  createSimpleUserUseCase,
}: {
  userRepo: UserRepo;
  parentRepo: ParentRepo;
  parentStudentService: ParentStudentService;
  userRoleService: UserRoleService;
  parentService: ParentService;
  createSimpleUserUseCase: CreateSimpleUserUseCase;
}) => {
  const studentRepo = new StudentRepo();
  const studentService = new StudentService(studentRepo);
  const createStudentWithParentUseCase = new CreateStudentWithParentUseCase(
    userRepo,
    studentRepo,
    parentRepo,
    createSimpleUserUseCase,
    parentStudentService,
    parentService,
    userRoleService,
  );
  const studentController = new StudentController(studentService, createStudentWithParentUseCase);
  const studentRouter = createRouter(studentController);
  return {
    studentRouter,
    studentService,
  };
};
