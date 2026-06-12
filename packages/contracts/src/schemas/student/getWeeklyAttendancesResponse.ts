import type { AttendanceStatus, DayOfWeek } from '../../types/enums/enums';

export type StudentWeeklyAttendanceResponse = Record<
  DayOfWeek,
  {
    timetable: {
      id: string;
      day: DayOfWeek;
      startTime: string;
      endTime: string;
    };
    subject: {
      id: string;
      name: {
        en: string;
        fr: string;
        ar: string;
      };
    };
    attendance: {
      id: string;
      status: AttendanceStatus | null;
      note: string | null;
    };
  }[]
>;
