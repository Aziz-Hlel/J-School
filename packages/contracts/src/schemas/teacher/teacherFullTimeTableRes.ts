import type { DayOfWeek } from '../../types/enums/enums';

export type TeacherFullTimetableRes = Record<
  DayOfWeek,
  {
    timetableId: string;
    subjectId: string;
    subjectName: {
      en: string;
      fr: string;
      ar: string;
    };
    startTime: string;
    endTime: string;
    room: string | null;

    classroom: {
      id: string;
      name: string;
      grade: string;
    };
  }[]
>;
