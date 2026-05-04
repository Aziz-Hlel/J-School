import { AccountRole, ClassGrade, SubjectDomain, UserRole } from '@repo/db/prisma/enums';
import { UserRoleSimple } from '@repo/contracts/types/enums/meta/userRoleMeta';
import type { InitSubjectWithExamsType } from '@repo/contracts/const/subjectAndExams/type';
import { subjectsGradeSix } from '@repo/contracts/const/subjectAndExams/grade.six';

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
  classrooms: {
    name: string;
    grade: ClassGrade;
    description?: string;
  }[];
  subjects_with_exams: Partial<Record<ClassGrade, Record<string, InitSubjectWithExamsType>>>;
  data: Partial<
    Record<
      ClassGrade,
      {
        grade: ClassGrade;
        classrooms: string[];
        subjects_with_exams: Record<string, InitSubjectWithExamsType>;
      }
    >
  >;
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
      email: 'director1@fake.com',
      role: UserRole.DIRECTOR,
    },
    {
      email: 'director2@fake.com',
      role: UserRole.DIRECTOR,
    },
    {
      email: 'manager1@fake.com',
      role: UserRole.MANAGER,
    },
    {
      email: 'manager2@fake.com',
      role: UserRole.MANAGER,
    },
    {
      email: 'nurse1@fake.com',
      role: UserRole.NURSE,
    },
    {
      email: 'nurse2@fake.com',
      role: UserRole.NURSE,
    },
    {
      email: 'driver1@fake.com',
      role: UserRole.DRIVER,
    },
    {
      email: 'driver2@fake.com',
      role: UserRole.DRIVER,
    },
    {
      email: 'parent1@fake.com',
      role: UserRole.PARENT,
      students: [
        {
          uid: 'student1',
          grade: ClassGrade.ONE,
        },
        {
          uid: 'student2',
          grade: ClassGrade.TWO,
        },
      ],
    },
    {
      email: 'parent2@fake.com',
      role: UserRole.PARENT,
      students: [
        {
          uid: 'student3',
          grade: ClassGrade.ONE,
        },
        {
          uid: 'student4',
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
  classrooms: [
    {
      name: 'A',
      grade: ClassGrade.SIX,
    },
    {
      name: 'B',
      grade: ClassGrade.SIX,
    },
  ],
  subjects_with_exams: {
    [ClassGrade.SIX]: subjectsGradeSix,
  },

  data: {
    [ClassGrade.SIX]: {
      grade: ClassGrade.SIX,
      classrooms: ['A', 'B'],
      subjects_with_exams: subjectsGradeSix,
    },
  },
} as const;

export const data = [tenant1];
