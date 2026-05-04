import type { SubjectDomain } from '../../../types/enums/enums';

export type ClassroomExamScheduleResponse = {
  id: string;
  name: {
    en: string;
    fr: string;
    ar: string;
  };
  day: string | null;
  endTime: string | null;
  startTime: string | null;
  subject: {
    id: string;
    domain: SubjectDomain;
    name: {
      en: string;
      fr: string;
      ar: string;
    };
  };
};
