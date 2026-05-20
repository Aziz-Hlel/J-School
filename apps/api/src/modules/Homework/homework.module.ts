import { HomeworkController } from './homework.controller';
import { createRouter } from './homework.route';
import { HomeworkService } from './homework.service';

export const HomeworkModule = () => {
  const service = new HomeworkService();
  const controller = new HomeworkController(service);
  const homeworkRouter = createRouter(controller);
  return {
    homeworkRouter,
  };
};
