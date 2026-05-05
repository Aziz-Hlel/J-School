import type { DayOfWeek, Gender } from '../../types/enums/enums';

export type ExtraCurricularResponse = {
  id: string;
  title: {
    en: string;
    fr: string;
    ar: string;
  };
  session: {
    day: DayOfWeek | null;
    startTime: string | null;
    endTime: string | null;
  };
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    gender: Gender;
  } | null;
  createdAt: string;
};
