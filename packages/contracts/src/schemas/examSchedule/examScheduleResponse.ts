export type ExamScheduleResponse = {
  id: string;
  day: string | null;
  startTime: string | null;
  endTime: string | null;
  exam: {
    id: string;
    name: {
      en: string;
      fr: string;
      ar: string;
    };
    durationInMin: number;
  };
};
