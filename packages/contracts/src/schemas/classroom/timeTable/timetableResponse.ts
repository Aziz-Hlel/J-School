import type { DayOfWeek } from '../../types/enums/enums';

export type TimetableResponse = {
  id: string;
  assignmentId: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
};
