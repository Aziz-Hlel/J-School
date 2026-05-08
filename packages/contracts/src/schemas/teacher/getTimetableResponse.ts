import type { DayOfWeek } from '../../types/enums/enums';

export type TeacherTimetableRes = {
  id: string;
  day: DayOfWeek;
  endTime: string;
  startTime: string;
  subject: {
    name: {
      en: string;
      fr: string;
      ar: string;
    };
  };
  classroom: {
    id: string;
    name: string;
  };
};
