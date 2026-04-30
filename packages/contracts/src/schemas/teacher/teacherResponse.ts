import type { Gender } from '../../types/enums/enums';
import type { MediaResponse } from '../media/MediaResponse';

export type TeacherResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  gender: Gender;
  dateOfBirth: string | null;
  phone: string | null;
  cin: string | null;
  address: string | null;
  avatar: MediaResponse | null;

  createdAt: string;
  updatedAt: string;
};
