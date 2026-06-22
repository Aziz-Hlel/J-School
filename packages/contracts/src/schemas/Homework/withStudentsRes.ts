import type { Gender, HomeworkType } from '../../types/enums/enums';
import type { MediaResponseWithOrder } from '../media/MediaResponseWithOrder';
import type { SubjectResponse } from '../subject/subjectResponse';

export type HomeworkWithStudentsRes = {
  id: string;
  title: string | null;
  type: HomeworkType;
  content: string | null;
  files: MediaResponseWithOrder[];
  due: string;
  subject: SubjectResponse;
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
