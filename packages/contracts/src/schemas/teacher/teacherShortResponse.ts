import type { Gender } from '../../types/enums/enums';
import type { MediaResponse } from '../media/MediaResponse';

export type TeacherShortRes = {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  avatar: MediaResponse | null;
};
