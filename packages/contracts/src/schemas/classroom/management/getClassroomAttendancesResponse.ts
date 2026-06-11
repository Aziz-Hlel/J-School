import type { AttendanceStatus, Gender } from '../../../types/enums/enums';
import type { MediaResponse } from '../../media/MediaResponse';

export type ClassroomAttendancesResponse = {
  id: string;
  firstName_en: string | null;
  lastName_en: string | null;
  firstName_ar: string | null;
  lastName_ar: string | null;
  gender: Gender;
  avatar: MediaResponse | null;

  attendance: {
    id: string;
    status: AttendanceStatus | null;
  } | null;
};
