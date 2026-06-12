import type { AttendanceStatus, DayOfWeek } from '../../types/enums/enums';

export type StudentAttendanceResponse = {
  id: string;
  status: AttendanceStatus | null;
  note: string | null;
  subject: {
    name: {
      en: string;
      ar: string;
      fr: string;
    };
    day: DayOfWeek;
    startTime: string;
    endTime: string;
  };
};
