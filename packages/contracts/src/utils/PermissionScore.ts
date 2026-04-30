import { AccountRole, UserRole } from '../types/enums/enums';

export const APP_PERMISSION_SCORE: Record<AccountRole, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  USER: 1,
};

export const TENANT_PERMISSION_SCORE: Record<UserRole, number> = {
  DIRECTOR: 4,
  MANAGER: 3,
  TEACHER: 2,
  PARENT: 1,
  NURSE: 1,
  DRIVER: 1,
};
