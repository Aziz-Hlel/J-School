import type { ClassroomResponse } from '../classroom/classResponse';
import type { MediaResponseV2 } from '../media/MediaResponseV2';
import type { SubjectResponse } from '../subject/subjectResponse';
import type { TeacherResponse } from '../teacher/teacherResponse';

export type HomeworkResponse = {
  id: string;
  title: string;
  content: string;
  files: MediaResponseV2[];
  due: string;
  subject: SubjectResponse;
  classroom: ClassroomResponse;
  teacher: TeacherResponse;
};
