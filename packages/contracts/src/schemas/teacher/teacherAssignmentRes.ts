import type { ClassroomResponse } from '../classroom/classResponse';
import type { SubjectResponse } from '../subject/subjectResponse';

export type TeacherAssignmentRes = {
  id: string;
  classroom: ClassroomResponse;
  subject: SubjectResponse;
};
