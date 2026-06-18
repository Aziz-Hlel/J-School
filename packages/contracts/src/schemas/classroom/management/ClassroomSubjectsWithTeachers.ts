import type { Gender } from '../../../types/enums/enums';
import type { MediaResponse } from '../../media/MediaResponse';
import type { SubjectResponse } from '../../subject/subjectResponse';

export type ClassroomSubjectsWithTeachersResponse = SubjectResponse & {
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    avatar: MediaResponse | null;
  } | null;
};
