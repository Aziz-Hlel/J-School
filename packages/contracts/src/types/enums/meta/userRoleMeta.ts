import { UserRole } from '../enums';

type RoleMetadata = {
  [x in UserRole]: {
    name: x;
    hasExtendedTable: boolean;
    type: 'PARENT' | 'TEACHER' | 'STAFF';
  };
};

export const ROLE_METADATA = {
  [UserRole.DIRECTOR]: {
    name: 'DIRECTOR',
    hasExtendedTable: false,
    type: 'STAFF',
  },
  [UserRole.MANAGER]: {
    name: 'MANAGER',
    hasExtendedTable: false,
    type: 'STAFF',
  },
  [UserRole.TEACHER]: {
    name: 'TEACHER',
    hasExtendedTable: true,
    type: 'TEACHER',
  },
  [UserRole.PARENT]: {
    name: 'PARENT',
    hasExtendedTable: true,
    type: 'PARENT',
  },
  [UserRole.NURSE]: {
    name: 'NURSE',
    hasExtendedTable: false,
    type: 'STAFF',
  },
  [UserRole.DRIVER]: {
    name: 'DRIVER',
    hasExtendedTable: false,
    type: 'STAFF',
  },
} as const satisfies RoleMetadata;

export const userRolesSimple = Object.values(ROLE_METADATA)
  .filter((role) => !role.hasExtendedTable)
  .map((role) => role.name);

export type UserRoleSimple = (typeof userRolesSimple)[number];

export const userRolesStaff = Object.values(ROLE_METADATA)
  .filter((role) => role.type === 'STAFF')
  .map((role) => role.name);

export type UserRoleStaff = (typeof userRolesStaff)[number];

export const userRolesStaffSimple = userRolesStaff.filter(
  (role) => ROLE_METADATA[role].type === 'STAFF' && !ROLE_METADATA[role].hasExtendedTable,
);

export type UserRoleStaffSimple = (typeof userRolesStaffSimple)[number];
