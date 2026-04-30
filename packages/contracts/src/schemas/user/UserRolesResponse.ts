import type { UserRole } from '../../types/enums/enums';

export type UserRoleResponse = {
  id: string;
  role: UserRole;

  createdAt: string;
};
