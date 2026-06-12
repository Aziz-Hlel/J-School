import type { AttendanceStatus, Gender } from '../../../types/enums/enums';
import type { MediaResponse } from '../../media/MediaResponse';

export type ClassroomAttendancesResponse = {
  id: string;
  firstName: {
    en: string | null;
    ar: string | null;
  };
  lastName: {
    en: string | null;
    ar: string | null;
  };
  gender: Gender;
  avatar: MediaResponse | null;

  attendance: {
    id: string;
    status: AttendanceStatus | null;
    note: string | null;
  } | null;

  lastAttendance: {
    id: string;
    status: AttendanceStatus | null;
    note: string | null;
  } | null;
};
