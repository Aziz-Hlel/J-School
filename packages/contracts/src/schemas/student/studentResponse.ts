import type { Gender, StudentStatus } from '../../types/enums/enums';
import type { MediaResponse } from '../media/MediaResponse';

type LocalizedString = {
  en: string | null;
  ar: string | null;
};

export type StudentResponse = {
  id: string;
  uid: string | null;
  firstName: LocalizedString;
  lastName: LocalizedString;
  gender: Gender;
  dateOfBirth: string | null;
  avatar: MediaResponse | null;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
};
