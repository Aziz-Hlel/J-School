import { ClassroomManagementController } from './ClassroomManagement.controller';
import { createClassroomManagementRouter } from './ClassroomManagement.route';
import { ClassroomManagementService } from './ClassroomManagement.service';

export const ClassroomManagementModule = () => {
  const service = new ClassroomManagementService();
  const controller = new ClassroomManagementController(service);
  const classroomManagementRouter = createClassroomManagementRouter(controller);
  return { classroomManagementRouter };
};
