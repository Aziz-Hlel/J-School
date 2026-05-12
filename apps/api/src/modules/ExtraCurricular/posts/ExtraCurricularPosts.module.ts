import { ExtraCurricularPostsController } from './ExtraCurricularPosts.controller';
import { createExtraCurricularPostsRouter } from './ExtraCurricularPosts.route';
import { ExtraCurricularPostsService } from './ExtraCurricularPosts.service';

export const ExtraCurricularPostsModule = () => {
  const service = new ExtraCurricularPostsService();
  const controller = new ExtraCurricularPostsController(service);
  const extraCurricularPostsRouter = createExtraCurricularPostsRouter(controller);
  return { extraCurricularPostsRouter };
};
