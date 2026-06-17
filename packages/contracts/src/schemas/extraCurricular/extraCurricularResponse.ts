import type { DayOfWeek, Gender, SessionType } from '../../types/enums/enums';
import type { MediaResponse } from '../media/MediaResponse';

export type ExtraCurricularResponse = {
  id: string;
  title: {
    en: string;
    fr: string;
    ar: string;
  };
  session: {
    date: string | null;
    day: DayOfWeek | null;
    startTime: string | null;
    endTime: string | null;
    type: SessionType | null;
  };
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    avatar: MediaResponse | null;
  } | null;
  createdAt: string;
};
