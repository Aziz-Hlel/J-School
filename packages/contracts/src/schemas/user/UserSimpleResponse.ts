import type { Gender, UserStatus } from '../../types/enums/enums';
import type { UserRoleResponse } from './UserRolesResponse';

export type UserSimpleResponse = {
  id: string;
  firstName: string;
  lastName: string;

  gender: Gender;
  dateOfBirth: string | null;
  phone: string | null;
  address: string | null;
  cin: string | null;

  roles: UserRoleResponse[];

  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};
