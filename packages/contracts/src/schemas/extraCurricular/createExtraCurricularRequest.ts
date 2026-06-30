import z from 'zod';
import { globalExtraCurricular } from '../shared/extraCurricular.schema';

export const createExtraCurricularRequestSchema = z
  .object({
    title: z.object({
      en: globalExtraCurricular.title.en,
      fr: globalExtraCurricular.title.fr,
      ar: globalExtraCurricular.title.ar,
    }),
    startTime: globalExtraCurricular.startTime,
    endTime: globalExtraCurricular.endTime,
    teacherId: z.uuid().nullable(),
  })
  .and(
    z.discriminatedUnion('type', [
      z.object({
        type: z.literal('WEEKLY'),
        dayOfWeek: globalExtraCurricular.dayOfWeek,
        startTime: globalExtraCurricular.startTime,
        endTime: globalExtraCurricular.endTime,
      }),
      z.object({
        type: z.literal('SPECIAL'),
        date: globalExtraCurricular.date,
        startTime: globalExtraCurricular.startTime,
        endTime: globalExtraCurricular.endTime,
      }),
    ]),
  );

export type CreateExtraCurricularReq = z.infer<typeof createExtraCurricularRequestSchema>;
