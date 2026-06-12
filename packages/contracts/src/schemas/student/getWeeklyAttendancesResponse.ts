import type { AttendanceStatus, DayOfWeek } from '../../types/enums/enums';

export type StudentWeeklyAttendanceResponse = Record<
  DayOfWeek,
  {
    timetableId: string;
    status: AttendanceStatus | null;

    subjectId: string;
    subjectName: {
      en: string;
      fr: string;
      ar: string;
    };

    startTime: string;
    endTime: string;
  }[]
>;
