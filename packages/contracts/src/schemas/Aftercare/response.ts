import type { StudentResponse } from '../student/studentResponse';
import type { TeacherResponse } from '../teacher/teacherResponse';

export type AftercareResponse = {
  id: string;
  date: string;
  supervisor: TeacherResponse;
  students: StudentResponse[];
  createdAt: string;
  updatedAt: string;
};
