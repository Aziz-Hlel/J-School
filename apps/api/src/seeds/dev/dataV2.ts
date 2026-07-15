import { toCalendarDate } from '@/utils/dayjs';
import { subjectsGradeSix } from '@repo/contracts/const/subjectAndExams/grade.six';
import { BaseSubjectsKeys, InitSubjectWithExamsType } from '@repo/contracts/const/subjectAndExams/type';
import { ClassGrade, DayOfWeek, MediaType, ReactionType, SessionType } from '@repo/db/prisma/browser';
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
        subjectNameEn: subjectsGradeSix.sport.subject.name.en,
        day: DayOfWeek.MONDAY,
        startTime: '10:00',
        endTime: '11:30',
        room: 'Salle 2',
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
        day: DayOfWeek.THURSDAY,
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
      {
        subjectNameEn: subjectsGradeSix.arabic.subject.name.en,
        day: DayOfWeek.FRIDAY,
        startTime: '10:00',
        endTime: '12:00',
        room: 'Salle 2',
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
        day: DayOfWeek.THURSDAY,
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
    teacherEmail: teacherSeedData.director1.email,
    subjectNameEn: subjectsGradeSix.arabic.subject.name.en,
    classroomName: classroomsSeedData.A.name,
    grade: ClassGrade.SIX,
  },
  {
    teacherEmail: teacherSeedData.director1.email,
    subjectNameEn: subjectsGradeSix.french.subject.name.en,
    classroomName: classroomsSeedData.B.name,
    grade: ClassGrade.SIX,
  },
  {
    teacherEmail: teacherSeedData.director1.email,
    subjectNameEn: subjectsGradeSix.math.subject.name.en,
    classroomName: classroomsSeedData.A.name,
    grade: ClassGrade.SIX,
  },
  {
    teacherEmail: teacherSeedData.director1.email,
    subjectNameEn: subjectsGradeSix.science.subject.name.en,
    classroomName: classroomsSeedData.A.name,
    grade: ClassGrade.SIX,
  },
];

export const extraCurricularSeedData = {
  mat_6eme: {
    id: genUuid('mat_6eme'),
    name: 'Etud Mat',
  },
  english_6eme: {
    id: genUuid('english_6eme'),
    name: 'Etud English',
  },
  tripHammamet: {
    id: genUuid('tripHammamet'),
    name: 'Trip Hammamet',
  },
};

export const extraCurricularSessionSeedData: Record<
  string,
  {
    id: string;
    day?: DayOfWeek;
    date?: string;
    startTime: string;
    endTime?: string;
    extraCurricularId: string;
    type: SessionType;
  }
> = {
  mat_6emeSession: {
    id: genUuid('mat_6emeSession'),
    extraCurricularId: extraCurricularSeedData.mat_6eme.id,
    day: DayOfWeek.MONDAY,
    type: SessionType.WEEKLY,
    startTime: '16:00',
    endTime: '17:30',
  },
  english_6emeSession: {
    id: genUuid('english_6emeSession'),
    extraCurricularId: extraCurricularSeedData.english_6eme.id,
    day: DayOfWeek.WEDNESDAY,
    type: SessionType.WEEKLY,
    startTime: '16:00',
    endTime: '17:30',
  },
  tripHammametSession: {
    id: genUuid('tripHammametSession'),
    extraCurricularId: extraCurricularSeedData.tripHammamet.id,
    date: '2026-07-01',
    type: SessionType.SPECIAL,
    startTime: '16:00',
  },
};

export const extraCurricularStudentAssignmentSeedData = [
  {
    extraCurricularId: extraCurricularSeedData.mat_6eme.id,
    studentId: studentSeedData.student1.id,
  },
  {
    extraCurricularId: extraCurricularSeedData.english_6eme.id,
    studentId: studentSeedData.student1.id,
  },
  {
    extraCurricularId: extraCurricularSeedData.tripHammamet.id,
    studentId: studentSeedData.student1.id,
  },
  {
    extraCurricularId: extraCurricularSeedData.mat_6eme.id,
    studentId: studentSeedData.student2.id,
  },
  {
    extraCurricularId: extraCurricularSeedData.english_6eme.id,
    studentId: studentSeedData.student2.id,
  },
  {
    extraCurricularId: extraCurricularSeedData.tripHammamet.id,
    studentId: studentSeedData.student2.id,
  },
  {
    extraCurricularId: extraCurricularSeedData.mat_6eme.id,
    studentId: studentSeedData.student3.id,
  },
  {
    extraCurricularId: extraCurricularSeedData.english_6eme.id,
    studentId: studentSeedData.student3.id,
  },
  {
    extraCurricularId: extraCurricularSeedData.tripHammamet.id,
    studentId: studentSeedData.student3.id,
  },
];

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
  {
    extraCurricular: extraCurricularSeedData.tripHammamet,
    teacher: teacherSeedData.teacher1,
  },
];

export const studentClassroomAssignmentSeedData = [
  {
    classroom: classroomsSeedData.A,
    students: [studentSeedData.student1, studentSeedData.student2, studentSeedData.student4, studentSeedData.student5],
  },
  {
    classroom: classroomsSeedData.B,
    students: [studentSeedData.student3],
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
  EidAdha: {
    id: genUuid('EidAdha'),
    name: 'EidAdha',
    title: 'Eid Adha',
    description: 'Eid Adha moubarak a tous',
    content: [
      MediaType.IMAGE,
      MediaType.IMAGE,
      MediaType.IMAGE,
      MediaType.IMAGE,
      MediaType.IMAGE,
      MediaType.IMAGE,
      MediaType.IMAGE,
    ],
    createdAt: new Date('2026-06-10'),
  },
  AidFitr: {
    id: genUuid('AidFitr'),
    name: 'AidFitr',
    title: 'Aid el fitr',
    description: 'nous vous souhaitons un excellent aid el fitr',
    content: [MediaType.IMAGE, MediaType.IMAGE, MediaType.IMAGE],
    createdAt: new Date('2026-04-10'),
  },
  Ramdhan: {
    id: genUuid('Ramdhan'),
    name: 'Ramdhan',
    title: 'Ramdhan kareem',
    description: 'nous vous souhaitons un excellent mois de ramdhan',
    content: [MediaType.IMAGE, MediaType.IMAGE],
    createdAt: new Date('2026-03-23'),
  },
  Rentree: {
    id: genUuid('Rentree'),
    name: 'Rentree',
    title: 'Rentree scolaire 2025-2026',
    description: 'bienvenue a tous les eleves et personnels de notre ecole',
    content: [MediaType.IMAGE],
    createdAt: new Date('2025-09-01'),
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
    title: 'Excellent work',
    content: 'Excellent work on this assignment!',
    parentReply: 'Thank you for your feedback!',
    teacher: teacherSeedData.director1,
    student: studentSeedData.student1,
  },
  {
    id: genUuid('teacherComment2'),
    title: 'Keep up the great effort',
    content: 'Keep up the great effort!',
    parentReply: 'Thank you for your feedback!',
    teacher: teacherSeedData.director1,
    student: studentSeedData.student1,
  },
  {
    id: genUuid('teacherComment3'),
    title: 'Good understanding',
    content: 'Good understanding of the material.',
    parentReply: 'Thank you for your feedback!',
    teacher: teacherSeedData.director1,
    student: studentSeedData.student1,
  },
  {
    id: genUuid('teacherComment4'),
    title: 'Needs improvement',
    content: 'Needs improvement in the calculation part.',
    parentReply: 'Thank you for your feedback!',
    teacher: teacherSeedData.director1,
    student: studentSeedData.student1,
  },
  {
    id: genUuid('teacherComment5'),
    title: 'Excellent analysis',
    content: 'Excellent analysis!',
    parentReply: 'Thank you for your feedback!',
    teacher: teacherSeedData.teacher1,
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

// export const attendanceSeedData = [
//   {
//     week:toWeekNbr(),
//     timetable:timetableSeedData[0],

// ]

type ExamScheduleSeedData = {
  [key in ClassroomName]?: {
    classroomName: ClassroomName;
    examSchedules: {
      subjectNameEn: SubjectNameEn;
      examNameEn: string;
      day: string;
      startTime: string;
      endTime: string;
    }[];
  };
};

export const examScheduleSeedData: ExamScheduleSeedData = {
  A: {
    classroomName: 'A',
    examSchedules: [
      {
        subjectNameEn: subjectsGradeSix.arabic.subject.name.en,
        examNameEn: subjectsGradeSix.arabic.exams[0]!.name.en,
        day: '2026-06-25',
        startTime: '08:00',
        endTime: '10:00',
      },
      {
        subjectNameEn: subjectsGradeSix.arabic.subject.name.en,
        examNameEn: subjectsGradeSix.arabic.exams[1]!.name.en,
        day: '2026-06-25',
        startTime: '10:30',
        endTime: '12:30',
      },
      {
        subjectNameEn: subjectsGradeSix.math.subject.name.en,
        examNameEn: subjectsGradeSix.math.exams[0]!.name.en,
        day: '2026-06-26',
        startTime: '13:00',
        endTime: '15:00',
      },
      {
        subjectNameEn: subjectsGradeSix.french.subject.name.en,
        examNameEn: subjectsGradeSix.french.exams[0]!.name.en,
        day: '2026-06-27',
        startTime: '10:30',
        endTime: '12:30',
      },
    ],
  },
  B: {
    classroomName: 'B',
    examSchedules: [
      {
        subjectNameEn: subjectsGradeSix.math.subject.name.en,
        examNameEn: subjectsGradeSix.math.exams[0]!.name.en,
        day: '2026-06-26',
        startTime: '08:00',
        endTime: '10:00',
      },
    ],
  },
} as const satisfies ExamScheduleSeedData;
