import type { Gender, UserStatus } from '@repo/db/prisma/enums';
import type { MediaResponse } from '../media/MediaResponse';
import type { UserRoleResponse } from './UserRolesResponse';

export type UserWithAvatarRes = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;

  gender: Gender;
  dateOfBirth: string | null;
  phone: string | null;
  address: string | null;
  cin: string | null;

  roles: UserRoleResponse[];

  avatar: MediaResponse | null;

  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};
