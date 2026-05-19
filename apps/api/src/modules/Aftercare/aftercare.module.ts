import { AftercareController } from './aftercare.controller';
import { createRouter } from './aftercare.route';
import { AftercareService } from './aftercare.service';

export const AftercareModule = () => {
  const service = new AftercareService();
  const controller = new AftercareController(service);
  const aftercareRouter = createRouter(controller);
  return {
    aftercareRouter,
  };
};
