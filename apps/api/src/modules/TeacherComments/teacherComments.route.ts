import { Router } from 'express';
import { TeacherCommentsController } from './teacherComments.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';

export const createRouter = (controller: TeacherCommentsController) => {
  const router = Router({ mergeParams: true });
  router.post('/', requireAuth, asyncHandler(controller.create));
  router.put('/:teacherCommentId/reply', requireAuth, asyncHandler(controller.replyComment));
  router.put('/:teacherCommentId', requireAuth, asyncHandler(controller.update));
  router.delete('/:teacherCommentId', requireAuth, asyncHandler(controller.delete));
  router.get('/:teacherCommentId', requireAuth, asyncHandler(controller.findById));
  return router;
};
