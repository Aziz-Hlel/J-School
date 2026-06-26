import type { ClassGrade, SubjectDomain } from '@repo/db/prisma/browser';
import type { LocalizedString } from '../../../jobs/notificationJob';
import type { Gender } from '../../../types/enums/enums';
import type { MediaResponse } from '../../media/MediaResponse';

export type ClassroomSubjectsWithTeachersResponse = {
  id: string;
  name: LocalizedString;
  grade: ClassGrade;
  hoursPerWeek: number;
  domain: SubjectDomain;
  assignmentId: string;
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    avatar: MediaResponse | null;
  } | null;
};
