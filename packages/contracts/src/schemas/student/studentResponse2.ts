import type { ClassGrade, Gender, StudentStatus } from '../../types/enums/enums';
import type { ClassroomResponse } from '../classroom/classResponse';
import type { MediaResponse } from '../media/MediaResponse';

type LocalizedString = {
  en: string | null;
  ar: string | null;
};

export type StudentResponse2 = {
  id: string;
  uid: string | null;
  firstName: LocalizedString;
  lastName: LocalizedString;
  gender: Gender;
  dateOfBirth: string | null;
  avatar: MediaResponse | null;
  status: StudentStatus;
  classroom: ClassroomResponse | null;
  createdAt: string;
  updatedAt: string;
};
