import { MobileController } from './mobile.controller';
import { createRouter } from './mobile.route';
import { MobileService } from './mobile.service';

export const MobileModule = () => {
  const service = new MobileService();
  const controller = new MobileController(service);
  const mobileRouter = createRouter(controller);
  return {
    mobileRouter,
  };
};
