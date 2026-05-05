import z from 'zod';
import { DayOfWeek, ClassGrade } from '../../types/enums/enums';

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
};
