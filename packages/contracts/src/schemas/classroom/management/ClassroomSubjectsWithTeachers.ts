import type { Gender } from '../../../types/enums/enums';
import type { SubjectResponse } from '../../subject/subjectResponse';

export type ClassroomSubjectsWithTeachersResponse = SubjectResponse & {
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    gender: Gender;
  } | null;
};
