import { RootController } from './root.controller';
import { createRouter } from './root.route';
import { RootAppService } from './root.app.service';

export const createRootModule = () => {
  const appService = new RootAppService();
  const controller = new RootController(appService);
  const rootRouter = createRouter(controller);
  return { rootRouter };
};
