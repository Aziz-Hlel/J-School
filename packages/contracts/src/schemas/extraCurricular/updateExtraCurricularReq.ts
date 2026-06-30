import { SessionType } from '@repo/db/prisma/browser';
import { z } from 'zod';
import { globalExtraCurricular } from '../shared/extraCurricular.schema';

export const updateExtraCurricularReqSchema = z
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
        type: z.literal(SessionType.WEEKLY),
        dayOfWeek: globalExtraCurricular.dayOfWeek,
      }),
      z.object({
        type: z.literal(SessionType.SPECIAL),
        date: globalExtraCurricular.date,
      }),
    ]),
  );

export type UpdateExtraCurricularReq = z.infer<typeof updateExtraCurricularReqSchema>;
