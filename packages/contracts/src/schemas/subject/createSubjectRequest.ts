import z from 'zod';
import { globalSubjectSchema } from '../shared/subject.schema';

export const createSubjectRequestSchema = z.object({
  name: z.object({
    en: globalSubjectSchema.name_en,
    fr: globalSubjectSchema.name_fr,
    ar: globalSubjectSchema.name_ar,
  }),
  grade: globalSubjectSchema.grade,
  hoursPerWeek: globalSubjectSchema.hoursPerWeek,
  domain: globalSubjectSchema.domain,
});

export type CreateSubjectRequest = z.infer<typeof createSubjectRequestSchema>;
