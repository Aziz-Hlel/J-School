import { Router } from 'express';
import { ClassroomController } from './classroom.controller';

export const createRouter = (classController: ClassroomController) => {
  const router = Router({ mergeParams: true });

  router.post('/', classController.create);

  router.get('/', classController.findAll);
  router.get('/:classroomId', classController.findById);

  router.put('/:classroomId', classController.update);

  return router;
};
