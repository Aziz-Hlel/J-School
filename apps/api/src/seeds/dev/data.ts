import { subjectsGradeSix } from '@repo/contracts/const/subjectAndExams/grade.six';
import type { BaseSubjectsKeys, InitSubjectWithExamsType } from '@repo/contracts/const/subjectAndExams/type';
import { UserRoleSimple } from '@repo/contracts/types/enums/meta/userRoleMeta';
import { AccountRole, ClassGrade, DayOfWeek, UserRole } from '@repo/db/prisma/enums';

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
  users: SeedSimpleUser[];
  parentsWithStudents: SeedParentUser[];

  students: {
    uid: string;
    grade: ClassGrade;
  }[];

  subjects_with_exams: Partial<Record<ClassGrade, Record<string, InitSubjectWithExamsType>>>;
  data: Partial<
    Record<
      ClassGrade,
      {
        grade: ClassGrade;
        classrooms: string[];
        subjects_with_exams: Partial<
          Record<
            BaseSubjectsKeys,
            InitSubjectWithExamsType & { timetable?: { day: DayOfWeek; startTime: string; endTime: string }[] }
          >
        >;
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
  ],

  parentsWithStudents: [
    {
      email: 'parent1@fake.com',
      role: UserRole.PARENT,
      students: [
        {
          uid: 'student1',
          grade: ClassGrade.SIX,
        },
        {
          uid: 'student2',
          grade: ClassGrade.SIX,
        },
      ],
    },
    {
      email: 'parent2@fake.com',
      role: UserRole.PARENT,
      students: [
        {
          uid: 'student3',
          grade: ClassGrade.SIX,
        },
        {
          uid: 'student4',
          grade: ClassGrade.SIX,
        },
        {
          uid: 'student5',
          grade: ClassGrade.SIX,
        },
      ],
    },
  ],

  subjects_with_exams: {
    [ClassGrade.SIX]: subjectsGradeSix,
  },

  students: [
    {
      uid: 'student1',
      grade: ClassGrade.SIX,
    },
    {
      uid: 'student2',
      grade: ClassGrade.SIX,
    },
    {
      uid: 'student3',
      grade: ClassGrade.SIX,
    },
    {
      uid: 'student4',
      grade: ClassGrade.SIX,
    },
    {
      uid: 'student5',
      grade: ClassGrade.SIX,
    },
    {
      uid: 'student6',
      grade: ClassGrade.SIX,
    },
    {
      uid: 'student7',
      grade: ClassGrade.SIX,
    },
    {
      uid: 'student8',
      grade: ClassGrade.SIX,
    },
    {
      uid: 'student9',
      grade: ClassGrade.SIX,
    },
    {
      uid: 'student10',
      grade: ClassGrade.SIX,
    },
  ],

  data: {
    [ClassGrade.SIX]: {
      grade: ClassGrade.SIX,
      classrooms: ['A', 'B'],
      subjects_with_exams: {
        ...subjectsGradeSix,
        arabic: {
          ...subjectsGradeSix.arabic,
          timetable: [
            { day: DayOfWeek.MONDAY, startTime: '08:00', endTime: '10:00' },
            { day: DayOfWeek.WEDNESDAY, startTime: '08:00', endTime: '10:00' },
            { day: DayOfWeek.FRIDAY, startTime: '08:00', endTime: '10:00' },
          ],
        },
      },
    },
  },
} as const;

export const data = [tenant1];
