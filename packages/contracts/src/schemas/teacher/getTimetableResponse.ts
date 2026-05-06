import type { DayOfWeek } from '../../types/enums/enums';

export type teacherTimetableRes = {
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
    name: string;
  };
};
