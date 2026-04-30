import { UserRoles } from '@repo/db/prisma/client';
import { userRolesStaff } from '@repo/contracts/types/enums/meta/userRoleMeta';

export class StaffHelper {
  isStaff = (roles: UserRoles[]) => {
    return roles.some((role) => role.role in userRolesStaff);
  };
}
