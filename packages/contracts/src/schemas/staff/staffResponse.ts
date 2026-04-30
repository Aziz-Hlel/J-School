import type { Gender } from '../../types/enums/enums';
import type { UserRoleResponse } from '../user/UserRolesResponse';

export type StaffResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  gender: Gender;
  dateOfBirth: string | null;
  phone: string | null;
  cin: string | null;
  address: string | null;
  roles: UserRoleResponse[];

  createdAt: string;
  updatedAt: string;
};
