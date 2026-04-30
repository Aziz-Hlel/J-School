import type { ClassGrade } from '../../types/enums/enums';

export type ClassroomResponse = {
  id: string;
  name: string;
  description: string | null;
  grade: ClassGrade;
  createdAt: string;
  updatedAt: string;
};
