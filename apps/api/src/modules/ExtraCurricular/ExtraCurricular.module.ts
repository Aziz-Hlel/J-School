import { ExtraCurricularController } from './ExtraCurricular.controller';
import { createRouter } from './ExtraCurricular.route';
import { ExtraCurricularService } from './ExtraCurricular.service';

export const ExtraCurricularModule = () => {
  const service = new ExtraCurricularService();
  const controller = new ExtraCurricularController(service);
  const extraCurricularRouter = createRouter(controller);
  return {
    extraCurricularRouter,
  };
};
