import type { DayOfWeek, SessionType } from '@repo/db/prisma/enums';

export type TeacherExtraCurricularResponse = {
  id: string;
  title: {
    en: string;
    fr: string;
    ar: string;
  };
  session: {
    day: DayOfWeek | null;
    startTime: string | null;
    endTime: string | null;
    date: string | null;
    type: SessionType | null;
  };
  createdAt: string;
};
