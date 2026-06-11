import { toCalendarDate } from '@/utils/dayjs';
import { subjectsGradeSix } from '@repo/contracts/const/subjectAndExams/grade.six';
import { BaseSubjectsKeys, InitSubjectWithExamsType } from '@repo/contracts/const/subjectAndExams/type';
import { ClassGrade, DayOfWeek, MediaType, ReactionType } from '@repo/db/prisma/browser';
import dayjs from 'dayjs';
import { mediaTypeSeed, MediaTypeSeed } from '../fakes/media.seed2';
import { genUuid } from '../helper/generateUuid';
import { studentSeedData, teacherSeedData } from './actors';

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
      room: string | null;
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
        room: 'Salle 1',
      },
      {
        subjectNameEn: subjectsGradeSix.arabic.subject.name.en,
        day: DayOfWeek.WEDNESDAY,
        startTime: '08:00',
        endTime: '10:00',
        room: 'Salle 12',
      },
      {
        subjectNameEn: subjectsGradeSix.arabic.subject.name.en,
        day: DayOfWeek.FRIDAY,
        startTime: '08:00',
        endTime: '10:00',
        room: 'Salle 3',
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
        room: 'Salle 4',
      },
      {
        subjectNameEn: subjectsGradeSix.math.subject.name.en,
        day: DayOfWeek.WEDNESDAY,
        startTime: '10:00',
        endTime: '12:00',
        room: 'Salle 4',
      },
      {
        subjectNameEn: subjectsGradeSix.math.subject.name.en,
        day: DayOfWeek.FRIDAY,
        startTime: '10:00',
        endTime: '12:00',
        room: 'Salle Electronique',
      },
    ],
  },
} as const satisfies TimeTableSeedData;

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

export const extraCurricularSeedData = {
  mat_6eme: {
    id: genUuid('mat_6eme'),
    name: 'Etud Mat',
    grade: ClassGrade.SIX,
  },
  english_6eme: {
    id: genUuid('english_6eme'),
    name: 'Etud English',
    grade: ClassGrade.SIX,
  },
};

export const extraCurricularSessionSeedData = {
  mat_6emeSession: {
    id: genUuid('mat_6emeSession'),
    extraCurricular: extraCurricularSeedData.mat_6eme,
    day: DayOfWeek.MONDAY,
    startTime: '16:00',
    endTime: '17:30',
  },
  english_6emeSession: {
    id: genUuid('english_6emeSession'),
    extraCurricular: extraCurricularSeedData.english_6eme,
    day: DayOfWeek.WEDNESDAY,
    startTime: '16:00',
    endTime: '17:30',
  },
};

export const postsSeedData = {
  post1: {
    id: genUuid('post1'),
    title: 'post1',
    content: 'Content 1',
    medias: [MediaType.IMAGE, MediaType.IMAGE],
    extraCurricular: extraCurricularSeedData.mat_6eme,
  },
  post2: {
    id: genUuid('post2'),
    title: 'post2',
    content: 'Content 2',
    medias: [MediaType.IMAGE, MediaType.IMAGE],
    extraCurricular: extraCurricularSeedData.mat_6eme,
  },
  post3: {
    id: genUuid('post3'),
    title: 'post3',
    content: 'Content 3',
    medias: [],
    extraCurricular: extraCurricularSeedData.mat_6eme,
  },
  post4: {
    id: genUuid('post4'),
    title: 'post4',
    content: 'Content 4',
    medias: [],
    extraCurricular: extraCurricularSeedData.mat_6eme,
  },
  post5: {
    id: genUuid('post5'),
    title: 'post5',
    content: 'Content 5',
    medias: [],
    extraCurricular: extraCurricularSeedData.mat_6eme,
  },
  post6: {
    id: genUuid('post6'),
    title: 'post6',
    content: 'Content 6',
    medias: [MediaType.IMAGE, MediaType.IMAGE, MediaType.IMAGE, MediaType.IMAGE],
    extraCurricular: extraCurricularSeedData.mat_6eme,
  },
  post7: {
    id: genUuid('post7'),
    title: 'post7',
    content: 'Content 7',
    medias: [MediaType.IMAGE, MediaType.IMAGE, MediaType.IMAGE, MediaType.IMAGE],
    extraCurricular: extraCurricularSeedData.mat_6eme,
  },
  post8: {
    id: genUuid('post8'),
    title: 'post8',
    content: 'Content 8',
    medias: [MediaType.IMAGE],
    extraCurricular: extraCurricularSeedData.mat_6eme,
  },
  post9: {
    id: genUuid('post9'),
    title: 'post9',
    content: 'Content 9',
    medias: [MediaType.IMAGE],
    extraCurricular: extraCurricularSeedData.mat_6eme,
  },
  post10: {
    id: genUuid('post10'),
    title: 'post10',
    content: 'Content 10',
    medias: [MediaType.IMAGE, MediaType.IMAGE],
    extraCurricular: extraCurricularSeedData.mat_6eme,
  },
} as const;

export const extraCurricularAssignmentSeedData = [
  {
    extraCurricular: extraCurricularSeedData.mat_6eme,
    teacher: teacherSeedData.teacher1,
  },
  {
    extraCurricular: extraCurricularSeedData.english_6eme,
    teacher: teacherSeedData.teacher2,
  },
];

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
    id: string;
    name: string;
    title: string;
    description: string;
    content: MediaTypeSeed[];
    createdAt: Date;
  };
};

export const announcementSeedData = {
  Rentree: {
    id: genUuid('Rentree'),
    name: 'Rentree',
    title: 'Rentree scolaire 2025-2026',
    description: 'bienvenue a tous les eleves et personnels de notre ecole',
    content: [MediaType.IMAGE, MediaType.IMAGE, MediaType.IMAGE, MediaType.IMAGE],
    createdAt: new Date('2025-09-01'),
  },

  Ramdhan: {
    id: genUuid('Ramdhan'),
    name: 'Ramdhan',
    title: 'Ramdhan kareem',
    description: 'nous vous souhaitons un excellent mois de ramdhan',
    content: [MediaType.IMAGE, MediaType.IMAGE, MediaType.IMAGE],
    createdAt: new Date('2026-03-23'),
  },

  AidFitr: {
    id: genUuid('AidFitr'),
    name: 'AidFitr',
    title: 'Aid el fitr',
    description: 'nous vous souhaitons un excellent aid el fitr',
    content: [MediaType.IMAGE, MediaType.IMAGE],
    createdAt: new Date('2026-04-10'),
  },
  EidAdha: {
    id: genUuid('EidAdha'),
    name: 'EidAdha',
    title: 'Eid Adha',
    description: 'Eid Adha moubarak a tous',
    content: [MediaType.IMAGE],
    createdAt: new Date('2026-06-10'),
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

export const teacherCommentsSeedData = [
  {
    id: genUuid('teacherComment1'),
    content: 'Excellent work on this assignment!',
    parentReply: 'Thank you for your feedback!',
    teacher: teacherSeedData.teacher1,
    student: studentSeedData.student1,
  },
  {
    id: genUuid('teacherComment2'),
    content: 'Keep up the great effort!',
    parentReply: 'Thank you for your feedback!',
    teacher: teacherSeedData.teacher2,
    student: studentSeedData.student1,
  },
  {
    id: genUuid('teacherComment3'),
    content: 'Good understanding of the material.',
    parentReply: 'Thank you for your feedback!',
    teacher: teacherSeedData.teacher3,
    student: studentSeedData.student1,
  },
  {
    id: genUuid('teacherComment4'),
    content: 'Needs improvement in the calculation part.',
    parentReply: 'Thank you for your feedback!',
    teacher: teacherSeedData.teacher4,
    student: studentSeedData.student1,
  },
  {
    id: genUuid('teacherComment5'),
    content: 'Excellent analysis!',
    parentReply: 'Thank you for your feedback!',
    teacher: teacherSeedData.teacher5,
    student: studentSeedData.student1,
  },
];

export const homeworkSeedData = [
  {
    id: genUuid('homework1'),
    assignment: teacherAssignmentSeedData[0]!,
    title: 'Calculus Assignment',
    content: 'Calculus Assignment',
    files: [mediaTypeSeed.IMAGE],
    due: toCalendarDate(dayjs().add(3, 'day').toDate()),
    students: studentClassroomAssignmentSeedData[0]!.students,
  },
  {
    id: genUuid('homework2'),
    assignment: teacherAssignmentSeedData[0]!,
    title: 'Algebra homework',
    content: 'Algebra homework',
    files: [mediaTypeSeed.IMAGE, mediaTypeSeed.IMAGE],
    due: toCalendarDate(dayjs().add(5, 'day').toDate()),
    students: studentClassroomAssignmentSeedData[0]!.students,
  },
  {
    id: genUuid('homework3'),
    assignment: teacherAssignmentSeedData[0]!,
    title: 'Geometry homework',
    content: 'Calculus Assignment 3',
    files: [],
    due: toCalendarDate(dayjs().subtract(8, 'day').toDate()),
    students: studentClassroomAssignmentSeedData[0]!.students,
  },
];
