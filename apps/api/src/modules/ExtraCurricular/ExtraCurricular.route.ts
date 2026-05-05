import { Router } from 'express';
import { ExtraCurricularController } from './ExtraCurricular.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireUserPermission from '@/middleware/requirePermission.middleware';
import { UserRole } from '@repo/db/prisma/enums';

export const createRouter = (controller: ExtraCurricularController) => {
  const router = Router({ mergeParams: true });
  router.use(requireAuth);
  router.use(requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER, UserRole.TEACHER]));

  router.post('/', asyncHandler(controller.create));

  router.post('/:extraCurricularId/students/:studentId', asyncHandler(controller.assignToStudent));

  router.put('/:extraCurricularId', asyncHandler(controller.update));

  router.get('/', asyncHandler(controller.findAll));

  router.get('/:extraCurricularId/students', asyncHandler(controller.getStudents));

  router.get('/:extraCurricularId', asyncHandler(controller.findOne));

  router.delete('/:extraCurricularId/students/:studentId', asyncHandler(controller.unassignFromStudent));

  router.delete('/:extraCurricularId', asyncHandler(controller.delete));

  return router;
};
