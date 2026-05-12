import { FeeItemsController } from './feeItems.controller';
import { createRouter } from './feeItems.route';
import { FeeItemsService } from './feeItems.service';

export const FeeItemsModule = () => {
  const service = new FeeItemsService();
  const controller = new FeeItemsController(service);
  const feeItemsRouter = createRouter(controller);
  return {
    feeItemsRouter,
  };
};
