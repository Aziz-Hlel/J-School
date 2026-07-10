import type { ClassGrade, Gender } from '@repo/db/prisma/enums';
import { UserRole } from '../../types/enums/enums';
import type { AccountResponse } from '../account/accountResponse';
import type { MediaResponse } from '../media/MediaResponse';

type StudentResponse = {
  id: string;
  firstName: {
    en: string | null;
    ar: string | null;
  };
  lastName: {
    en: string | null;
    ar: string | null;
  };
  gender: Gender;
  schoolId: string;
  classroom: {
    id: string;
    name: string;
    grade: ClassGrade;
  } | null;
  avatar: MediaResponse | null;
};

type SchoolResponse = {
  id: string;
  slug: string;
  names: {
    en: string;
    fr: string;
    ar: string;
  };
};

export const schoolWorkspace = {
  ADMINISTRATION: 'ADMINISTRATION',
  PARENT: 'PARENT',
  TEACHER: 'TEACHER',
} as const;

export type SchoolWorkspace = (typeof schoolWorkspace)[keyof typeof schoolWorkspace];

export const administrationRoles = [UserRole.DIRECTOR, UserRole.MANAGER] as const satisfies readonly UserRole[];

export const administrationRolesSet = new Set(administrationRoles);

export type AdministrationRole = (typeof administrationRoles)[number];

export type AdministrationWorkspace =
  | {
      id: string;
      userId: string;
      firstName: string;
      lastName: string;
      role: AdministrationRole;
      school: SchoolResponse & {
        role: AdministrationRole;
      };
    }
  | {
      id: string;
      firstName: string;
      lastName: string;
      role: 'OWNER';
      school:
        | (SchoolResponse & {
            role: 'OWNER';
          })
        | null;
    };

export type TeacherWorkspace = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  school: SchoolResponse;
};

export type ParentWorkspace = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  school: SchoolResponse;
  student: StudentResponse;
};

export type AuthResponse = {
  account: AccountResponse;
  administration: AdministrationWorkspace[];
  teacher: TeacherWorkspace[];
  parent: ParentWorkspace[];
};
