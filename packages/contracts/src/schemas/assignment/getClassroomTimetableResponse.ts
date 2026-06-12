import { DayOfWeek, Gender } from '../../types/enums/enums';

export type GetClassroomTimetableResponse = Record<
  DayOfWeek,
  {
    timetable: {
      id: string;
      day: DayOfWeek;
      startTime: string;
      endTime: string;
      room: string | null;
    };
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
