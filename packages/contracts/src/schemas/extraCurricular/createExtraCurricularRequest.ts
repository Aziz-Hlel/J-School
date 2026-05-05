import z from 'zod';
import { globalExtraCurricular } from '../shared/extraCurricular.schema';

export const createExtraCurricularRequestSchema = z.object({
  title: z.object({
    en: globalExtraCurricular.title.en,
    fr: globalExtraCurricular.title.fr,
    ar: globalExtraCurricular.title.ar,
  }),
  grade: globalExtraCurricular.grade,
  dayOfWeek: globalExtraCurricular.dayOfWeek,
  startTime: globalExtraCurricular.startTime,
  endTime: globalExtraCurricular.endTime,
  teacherId: z.uuid().nullable(),
});

export type CreateExtraCurricularReq = z.infer<typeof createExtraCurricularRequestSchema>;
