import type { ClassroomResponse } from '../classroom/classResponse';
import type { SubjectResponse } from '../subject/subjectResponse';
import type { TeacherShortRes } from '../teacher/teacherShortResponse';

export type AssignmentRes = {
  id: string;
  classroom: ClassroomResponse;
  teacher: TeacherShortRes | null;
  subject: SubjectResponse;
};
