import type { Gender } from '@repo/db/prisma/browser';
import type { MediaResponse } from '../media/MediaResponse';

export type ExamScheduleResponse = {
  id: string;
  day: string | null;
  startTime: string | null;
  endTime: string | null;
  exam: {
    id: string;
    name: {
      en: string;
      fr: string;
      ar: string;
    };
    durationInMin: number;
  };
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: MediaResponse | null;
    gender: Gender;
  } | null;
};
