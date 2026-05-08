import { faker } from '@faker-js/faker';
import { subjectsGradeSix } from '@repo/contracts/const/subjectAndExams/grade.six';
import { BaseSubjectsKeys, InitSubjectWithExamsType } from '@repo/contracts/const/subjectAndExams/type';
import { ClassGrade, DayOfWeek, MediaType, ReactionType } from '@repo/db/prisma/browser';
import { MediaTypeSeed } from '../fakes/media.seed2';

export const subjectsWithExamsSeedData = {
  [ClassGrade.SIX]: {
    grade: ClassGrade.SIX,
    subjectsWithExams: subjectsGradeSix,
  },
} as const satisfies Partial<
  Record<
    ClassGrade,
    { grade: ClassGrade; subjectsWithExams: Partial<Record<BaseSubjectsKeys, InitSubjectWithExamsType>> }
  >
>;

type ClassroomsSeedData = {
  [key: string]: {
    name: string;
    grade: ClassGrade;
  };
};

export const classroomsSeedData = {
  A: {
    name: 'A',
    grade: ClassGrade.SIX,
  },
  B: {
    name: 'B',
    grade: ClassGrade.SIX,
  },
} as const satisfies ClassroomsSeedData;

type ClassroomName = (typeof classroomsSeedData)[keyof typeof classroomsSeedData]['name'];

type SubjectNameEn = (typeof subjectsGradeSix)[keyof typeof subjectsGradeSix]['subject']['name']['en'];

type TimeTableSeedData = {
  [key in ClassroomName]?: {
    classroomName: ClassroomName;
    timetable: {
      subjectNameEn: SubjectNameEn;
      day: DayOfWeek;
      startTime: string;
      endTime: string;
    }[];
  };
};

export const timeTableSeedData: TimeTableSeedData = {
  A: {
    classroomName: 'A',
    timetable: [
      {
        subjectNameEn: subjectsGradeSix.arabic.subject.name.en,
        day: DayOfWeek.MONDAY,
        startTime: '08:00',
        endTime: '10:00',
      },
      {
        subjectNameEn: subjectsGradeSix.arabic.subject.name.en,
        day: DayOfWeek.WEDNESDAY,
        startTime: '08:00',
        endTime: '10:00',
      },
      {
        subjectNameEn: subjectsGradeSix.arabic.subject.name.en,
        day: DayOfWeek.FRIDAY,
        startTime: '08:00',
        endTime: '10:00',
      },
    ],
  },

  B: {
    classroomName: 'B',
    timetable: [
      {
        subjectNameEn: subjectsGradeSix.math.subject.name.en,
        day: DayOfWeek.MONDAY,
        startTime: '10:00',
        endTime: '12:00',
      },
      {
        subjectNameEn: subjectsGradeSix.math.subject.name.en,
        day: DayOfWeek.WEDNESDAY,
        startTime: '10:00',
        endTime: '12:00',
      },
      {
        subjectNameEn: subjectsGradeSix.math.subject.name.en,
        day: DayOfWeek.FRIDAY,
        startTime: '10:00',
        endTime: '12:00',
      },
    ],
  },
} as const satisfies TimeTableSeedData;

export const teacherSeedData = {
  teacher1: {
    email: 'teacher1@fake.com',
  },
  teacher2: {
    email: 'teacher2@fake.com',
  },
  teacher3: {
    email: 'teacher3@fake.com',
  },
  teacher4: {
    email: 'teacher4@fake.com',
  },
  teacher5: {
    email: 'teacher5@fake.com',
  },
};

export const teacherAssignmentSeedData = [
  {
    teacherEmail: teacherSeedData.teacher1.email,
    subjectNameEn: subjectsGradeSix.arabic.subject.name.en,
    classroomName: classroomsSeedData.A.name,
    grade: ClassGrade.SIX,
  },
  {
    teacherEmail: teacherSeedData.teacher2.email,
    subjectNameEn: subjectsGradeSix.french.subject.name.en,
    classroomName: classroomsSeedData.B.name,
    grade: ClassGrade.SIX,
  },
];

export const studentSeedData = {
  student1: {
    uid: 'student1',
  },
  student2: {
    uid: 'student2',
  },
  student3: {
    uid: 'student3',
  },
  student4: {
    uid: 'student4',
  },
  student5: {
    uid: 'student5',
  },
};

export const studentClassroomAssignmentSeedData = [
  {
    classroom: classroomsSeedData.A,
    students: [
      studentSeedData.student1,
      studentSeedData.student2,
      studentSeedData.student3,
      studentSeedData.student4,
      studentSeedData.student5,
    ],
  },
];

type AnnouncementSeedDataType = {
  [key: string]: {
    name: string;
    description: string;
    content: MediaTypeSeed[];
    createdAt: Date;
  };
};

export const announcementSeedData = {
  Rentree: {
    name: 'Rentree',
    description: 'Rentree scolaire 2025-2026, \n bienvenue a tous les eleves et personnels de notre ecole',
    content: [MediaType.VIDEO, MediaType.IMAGE],
    createdAt: new Date('2025-09-01'),
  },
  Ramdhan: {
    name: 'Ramdhan',
    description: 'Ramdhan kareem, \n nous vous souhaitons un excellent mois de ramdhan',
    content: [MediaType.IMAGE],
    createdAt: new Date('2025-03-23'),
  },
  AidFitr: {
    name: 'AidFitr',
    description: 'Aid el fitr, \n nous vous souhaitons un excellent aid el fitr',
    content: [MediaType.IMAGE],
    createdAt: new Date('2025-04-10'),
  },
} as const satisfies AnnouncementSeedDataType;

export const reactionSeedData = [
  {
    announcement: announcementSeedData.Rentree,
    reactions: [
      {
        accountEmail: teacherSeedData.teacher1.email,
        type: ReactionType.LIKE,
      },
      {
        accountEmail: teacherSeedData.teacher2.email,
        type: ReactionType.LIKE,
      },
      {
        accountEmail: teacherSeedData.teacher3.email,
        type: ReactionType.LIKE,
      },
      {
        accountEmail: teacherSeedData.teacher4.email,
        type: ReactionType.LIKE,
      },
      {
        accountEmail: teacherSeedData.teacher5.email,
        type: ReactionType.LIKE,
      },
    ],
  },
  {
    announcement: announcementSeedData.Ramdhan,
    reactions: [
      {
        accountEmail: teacherSeedData.teacher1.email,
        type: ReactionType.HEART,
      },
      {
        accountEmail: teacherSeedData.teacher2.email,
        type: ReactionType.HEART,
      },
      {
        accountEmail: teacherSeedData.teacher3.email,
        type: ReactionType.HEART,
      },
      {
        accountEmail: teacherSeedData.teacher4.email,
        type: ReactionType.HEART,
      },
      {
        accountEmail: teacherSeedData.teacher5.email,
        type: ReactionType.HEART,
      },
    ],
  },
];
