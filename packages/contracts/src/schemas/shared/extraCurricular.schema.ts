import z from 'zod';
import { DayOfWeek } from '../../types/enums/enums';

export const globalExtraCurricular = {
  title: {
    en: z.string(),
    fr: z.string(),
    ar: z.string(),
  },
  dayOfWeek: z.enum(DayOfWeek),
  startTime: z.iso.time(),
  endTime: z.iso.time().or(z.null()),
};
