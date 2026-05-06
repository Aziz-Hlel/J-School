import type { AttendanceStatus } from '../../../types/enums/enums';

export type ClassroomAttendancesResponse = {
  id: string;
  firstName_en: string | null;
  lastName_en: string | null;
  firstName_ar: string | null;
  lastName_ar: string | null;
  attendance: {
    id: string;
    status: AttendanceStatus | null;
  } | null;
};
