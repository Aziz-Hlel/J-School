import { z } from 'zod';
import { globalExtraCurricular } from '../shared/extraCurricular.schema';

export const updateExtraCurricularReqSchema = z.object({
  title: z.object({
    en: globalExtraCurricular.title.en,
    fr: globalExtraCurricular.title.fr,
    ar: globalExtraCurricular.title.ar,
  }),
  dayOfWeek: globalExtraCurricular.dayOfWeek,
  startTime: globalExtraCurricular.startTime,
  endTime: globalExtraCurricular.endTime,
  teacherId: z.uuid().nullable(),
});

export type UpdateExtraCurricularReq = z.infer<typeof updateExtraCurricularReqSchema>;
