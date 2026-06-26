import { DayOfWeek, Gender } from '../../types/enums/enums';

export type GetClassroomTimetableResponse = Record<
  DayOfWeek,
  {
    id: string;
    day: DayOfWeek;
    startTime: string;
    endTime: string;
    room: string | null;
    assignmentId: string;
    subject: {
      id: string;
      name: {
        en: string;
        fr: string;
        ar: string;
      };
    };
    teacher: { firstName: string; lastName: string; gender: Gender; id: string } | null;
  }[]
>;
