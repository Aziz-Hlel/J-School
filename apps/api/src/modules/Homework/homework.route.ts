import { Router } from 'express';
import { HomeworkController } from './homework.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';

export const createRouter = (controller: HomeworkController) => {
  const router = Router({ mergeParams: true });
  router.post('/', requireAuth, asyncHandler(controller.create));
  router.put('/:homeworkId', requireAuth, asyncHandler(controller.update));
  router.delete('/:homeworkId', requireAuth, asyncHandler(controller.delete));
  router.get('/', requireAuth, asyncHandler(controller.find));
  router.get('/:homeworkId', requireAuth, asyncHandler(controller.findById));
  return router;
};
