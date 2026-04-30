import { DayOfWeek, Gender } from '../../types/enums/enums';

export type GetClassroomTimetableResponse = Record<
  DayOfWeek,
  {
    subjectId: string;
    subjectName: {
      en: string;
      fr: string;
      ar: string;
    };
    startTime: string;
    endTime: string;
    teacher: { firstName: string; lastName: string; gender: Gender; id: string } | null;
  }[]
>;
