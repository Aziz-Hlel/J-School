import { FeesController } from './fees.controller';
import { createRouter } from './fees.route';
import { FeesService } from './fees.service';

export const FeesModule = () => {
  const service = new FeesService();
  const controller = new FeesController(service);
  const feesRouter = createRouter(controller);
  return {
    feesRouter,
  };
};
