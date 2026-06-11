import type { DayOfWeek } from '../../types/enums/enums';

export type TeacherFullTimetableRes = Record<
  DayOfWeek,
  {
    id: string;
    endTime: string;
    startTime: string;
    room: string | null;
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
      grade: string;
    };
  }[]
>;
