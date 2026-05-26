import type { CalendarSessionType } from '@repo/db/prisma/enums';

export type CalendarResponse = {
  id: string;
  title: string;
  description: string | null;
  type: CalendarSessionType;
  startDate: string;
  startTime: string | null;
  endDate: string;
  endTime: string | null;
  createdAt: string;
  updatedAt: string;
};
