import { createRouter } from './classroom.route';
import { ClassroomService } from './classroom.service';
import { ClassroomRepo } from './classroom.repo';
import { ClassroomController } from './classroom.controller';
import { SubjectInternal } from '../subject/subject.internal';
import { AssignmentInternal } from '../assignment/assignment.internal';
import { CreateClassroomUseCase } from './use-case/createClassroom.use-case';

export const ClassroomModule = (services: {
  subjectInternal: SubjectInternal;
  assignmentInternal: AssignmentInternal;
}) => {
  const { subjectInternal, assignmentInternal } = services;
  const classesRepo = new ClassroomRepo();
  const classService = new ClassroomService(classesRepo);
  const createClassroomUseCase = new CreateClassroomUseCase(classesRepo, subjectInternal, assignmentInternal);
  const classController = new ClassroomController(classService, createClassroomUseCase);
  const classroomRouter = createRouter(classController);
  return { classroomRouter };
};
