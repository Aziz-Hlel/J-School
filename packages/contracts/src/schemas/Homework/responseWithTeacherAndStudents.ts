import type { Gender, HomeworkType } from '../../types/enums/enums';
import type { ClassroomResponse } from '../classroom/classResponse';
import type { MediaResponse } from '../media/MediaResponse';
import type { MediaResponseWithOrder } from '../media/MediaResponseWithOrder';
import type { SubjectResponse } from '../subject/subjectResponse';

export type HomeworkWithTeacherAndStudents = {
  id: string;
  title: string | null;
  type: HomeworkType;
  content: string | null;
  files: MediaResponseWithOrder[];
  due: string;
  subject: SubjectResponse;
  classroom: ClassroomResponse;
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    avatar: MediaResponse | null;
  } | null;
  students: {
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
  }[];
};
