import { container } from '@/container';
import { Router } from 'express';

const appRouter = Router();

container.forEach(({ router, resource }) => {
  appRouter.use(`/${resource}`, router);
});

export default appRouter;
