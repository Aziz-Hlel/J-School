import type { ClassroomResponse } from '../classroom/classResponse';
import type { ParentResponse } from '../parent/parentResponse';
import type { StudentProfileResponse } from '../studentProfile/studentProfileResponse';
import type { StudentResponse } from './studentResponse';

export type StudentFullDetailsResponse = StudentResponse & {
  profile: StudentProfileResponse | null;
  classroom: ClassroomResponse | null;
  parents: ParentResponse[];
};
