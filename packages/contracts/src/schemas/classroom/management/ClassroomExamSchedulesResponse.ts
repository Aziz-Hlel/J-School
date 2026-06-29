import type { Gender, SubjectDomain } from '@repo/db/prisma/browser';
import type { MediaResponse } from '../../media/MediaResponse';

export type ClassroomExamScheduleResponse = {
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
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: MediaResponse | null;
    gender: Gender;
  } | null;
};
