import type { DayOfWeek } from '../../types/enums/enums';

export type TeacherFullTimetableRes = Record<
  DayOfWeek,
  {
    timetable: {
      id: string;
      day: DayOfWeek;
      endTime: string;
      startTime: string;
      room: string | null;
    };
    subject: {
      id: string;
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
