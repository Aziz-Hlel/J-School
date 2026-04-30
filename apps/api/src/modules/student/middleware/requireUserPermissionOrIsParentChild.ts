import { UserRole } from '@repo/db/prisma/enums';
import requireUserPermission from '@/middleware/requirePermission.middleware';

export const requireUserPermissionOrIsParentChild = (requiredRoles: UserRole[]) => {
  // ! need to add logic for user is the parent of the student
  return requireUserPermission(requiredRoles);
};
