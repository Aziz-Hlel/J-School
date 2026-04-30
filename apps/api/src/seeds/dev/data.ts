import { AccountRole, ClassGrade, SubjectDomain, UserRole } from '@repo/db/prisma/enums';
import { UserRoleSimple } from '@repo/contracts/types/enums/meta/userRoleMeta';

type SeedSimpleUser = {
  email: string;
  role: UserRoleSimple;
};

type SeedParentUser = {
  email: string;
  role: typeof UserRole.PARENT;
  students: {
    uid: string;
    grade: ClassGrade;
  }[];
};

type SeedTenantData = {
  account: {
    email: string;
    role: 'ADMIN';
  };
  owner: {};
  school: {
    name: string;
  };
  users: (SeedSimpleUser | SeedParentUser)[];
  subjects: {
    name: {
      en: string;
      fr: string;
      ar: string;
    };
    grade: ClassGrade;
    domain: SubjectDomain;
    hoursPerWeek: number;
  }[];
};

const tenant1: SeedTenantData = {
  account: {
    email: 'tigana137@gmail.com',
    role: AccountRole.ADMIN,
  },
  owner: {},
  school: {
    name: 'School 1',
  },
  users: [
    {
      email: 'fake-director-1@gmail.com',
      role: UserRole.DIRECTOR,
    },
    {
      email: 'fake-director-2@gmail.com',
      role: UserRole.DIRECTOR,
    },
    {
      email: 'fake-manager-1@gmail.com',
      role: UserRole.MANAGER,
    },
    {
      email: 'fake-manager-2@gmail.com',
      role: UserRole.MANAGER,
    },
    {
      email: 'fake-nurse-1@gmail.com',
      role: UserRole.NURSE,
    },
    {
      email: 'fake-nurse-2@gmail.com',
      role: UserRole.NURSE,
    },
    {
      email: 'fake-driver-1@gmail.com',
      role: UserRole.DRIVER,
    },
    {
      email: 'fake-driver-2@gmail.com',
      role: UserRole.DRIVER,
    },
    {
      email: 'fake-parent-1@gmail.com',
      role: UserRole.PARENT,
      students: [
        {
          uid: 'student-1',
          grade: ClassGrade.ONE,
        },
        {
          uid: 'student-2',
          grade: ClassGrade.TWO,
        },
      ],
    },
    {
      email: 'fake-parent-2@gmail.com',
      role: UserRole.PARENT,
      students: [
        {
          uid: 'student-3',
          grade: ClassGrade.ONE,
        },
        {
          uid: 'student-4',
          grade: ClassGrade.TWO,
        },
      ],
    },
  ],
  subjects: [
    {
      name: {
        en: 'Mathematics',
        fr: 'Mathématiques',
        ar: 'الرياضيات',
      },
      grade: ClassGrade.ONE,
      domain: SubjectDomain.SCIENCE_TECHNOLOGY,
      hoursPerWeek: 3,
    },
    {
      name: {
        en: 'Physics',
        fr: 'Physique',
        ar: 'الفيزياء',
      },
      grade: ClassGrade.ONE,
      domain: SubjectDomain.SCIENCE_TECHNOLOGY,
      hoursPerWeek: 3,
    },
    {
      name: {
        en: 'Chemistry',
        fr: 'Chimie',
        ar: 'الكيمياء',
      },
      grade: ClassGrade.ONE,
      domain: SubjectDomain.SCIENCE_TECHNOLOGY,
      hoursPerWeek: 3,
    },
    {
      name: {
        en: 'Arabic',
        fr: 'Arabe',
        ar: 'العربية',
      },
      grade: ClassGrade.ONE,
      domain: SubjectDomain.ARABIC_LANGUAGE,
      hoursPerWeek: 3,
    },
    {
      name: {
        en: 'French',
        fr: 'Français',
        ar: 'الفرنسية',
      },
      grade: ClassGrade.ONE,
      domain: SubjectDomain.FRENCH_LANGUAGE,
      hoursPerWeek: 3,
    },
    {
      name: {
        en: 'English',
        fr: 'Anglais',
        ar: 'الإنجليزية',
      },
      grade: ClassGrade.ONE,
      domain: SubjectDomain.ENGLISH_LANGUAGE,
      hoursPerWeek: 3,
    },
  ],
} as const;

export const data = [tenant1];
