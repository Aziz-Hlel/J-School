import { subjectsGradeSix } from '@repo/contracts/const/subjectAndExams/grade.six';
import { BaseSubjectsKeys, InitSubjectWithExamsType } from '@repo/contracts/const/subjectAndExams/type';
import { ClassGrade, DayOfWeek } from '@repo/db/prisma/browser';

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
