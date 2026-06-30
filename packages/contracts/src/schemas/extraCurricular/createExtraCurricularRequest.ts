import z from 'zod';
import { globalExtraCurricular } from '../shared/extraCurricular.schema';
import { SessionType } from '@repo/db/prisma/browser';

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
        type: z.literal(SessionType.WEEKLY),
        dayOfWeek: globalExtraCurricular.dayOfWeek,
        startTime: globalExtraCurricular.startTime,
        endTime: globalExtraCurricular.endTime,
      }),
      z.object({
        type: z.literal(SessionType.SPECIAL),
        date: globalExtraCurricular.date,
        startTime: globalExtraCurricular.startTime,
        endTime: globalExtraCurricular.endTime,
      }),
    ]),
  );

export type CreateExtraCurricularReq = z.infer<typeof createExtraCurricularRequestSchema>;
