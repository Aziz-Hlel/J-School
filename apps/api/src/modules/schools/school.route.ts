import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireUserRoles from '@/middleware/requirePermission.middleware';
import requireRole from '@/middleware/requireRole.middleware';
import { AccountRole, UserRole } from '@repo/db/prisma/enums';
import { Router } from 'express';
import { SchoolController } from './school.controller';

export const createSchoolRoute = (controller: SchoolController) => {
  const router = Router();
  router.post('/', requireAuth, requireRole(AccountRole.ADMIN), asyncHandler(controller.create));

  router.get('/', requireAuth, requireRole(AccountRole.ADMIN), asyncHandler(controller.getPage));
  router.get('/me', requireAuth, requireRole(AccountRole.ADMIN), asyncHandler(controller.getMySchool));

  router.get(
    '/:schoolId/teacher-comments',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER, UserRole.TEACHER]),
    asyncHandler(controller.findTeacherComments),
  );

  router.get('/:schoolId', requireAuth, requireRole(AccountRole.ADMIN), asyncHandler(controller.getById));

  router.put('/:schoolId', requireAuth, requireRole(AccountRole.ADMIN), asyncHandler(controller.update));

  router.delete(
    '/:schoolId/teacher-comments/:teacherCommentId',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.deleteTeacherComment),
  );

  router.delete('/:schoolId', requireAuth, requireRole(AccountRole.ADMIN), asyncHandler(controller.delete));

  router.get(
    '/:schoolId/classrooms/select',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.selectClassrooms),
  );

  router.get(
    '/:schoolId/parents/select',
    requireAuth,
    requireUserRoles([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(controller.selectParents),
  );

  return router;
};
