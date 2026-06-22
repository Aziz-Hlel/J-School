import type { SubjectDomain } from '@repo/db/prisma/browser';
import type { ClassroomResponse } from '../classroom/classResponse';

export type ExamScheduleWithClassroomRes = {
  id: string;
  day: string | null;
  endTime: string | null;
  startTime: string | null;
  name: {
    en: string;
    fr: string;
    ar: string;
  };
  subject: {
    id: string;
    name: {
      en: string;
      fr: string;
      ar: string;
    };
    domain: SubjectDomain;
  };
  classroom: ClassroomResponse;
};
