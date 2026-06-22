import type { HomeworkType } from '../../types/enums/enums';
import type { ClassroomResponse } from '../classroom/classResponse';
import type { MediaResponseWithOrder } from '../media/MediaResponseWithOrder';
import type { SubjectResponse } from '../subject/subjectResponse';
import type { TeacherResponse } from '../teacher/teacherResponse';

export type HomeworkResponse = {
  id: string;
  title: string | null;
  type: HomeworkType;
  content: string | null;
  files: MediaResponseWithOrder[];
  due: string;
  subject: SubjectResponse;
  classroom: ClassroomResponse;
  teacher: TeacherResponse | null;
};
