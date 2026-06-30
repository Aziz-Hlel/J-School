import z from 'zod';
import { ClassGrade, DayOfWeek } from '../../types/enums/enums';

export const globalExtraCurricular = {
  title: {
    en: z.string(),
    fr: z.string(),
    ar: z.string(),
  },
  grade: z.enum(ClassGrade),
  dayOfWeek: z.enum(DayOfWeek),
  startTime: z.iso.time(),
  endTime: z.iso.time().or(z.null()),
  date: z.iso.date(),
};
