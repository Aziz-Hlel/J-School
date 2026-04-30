import type { Gender } from '../../types/enums/enums';
import type { MediaResponse } from '../media/MediaResponse';

export type ParentResponse = {
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
  emergencyPhone: string | null;

  createdAt: string;
  updatedAt: string;
};
