import z from 'zod';
import { globalSubjectSchema } from '../shared/subject.schema';

export const subjectResponseSchema = z.object({
  id: z.uuid(),
  name: z.object({
    en: globalSubjectSchema.name_en,
    fr: globalSubjectSchema.name_fr,
    ar: globalSubjectSchema.name_ar,
  }),
  grade: globalSubjectSchema.grade,
  hoursPerWeek: globalSubjectSchema.hoursPerWeek,
  domain: globalSubjectSchema.domain,
});

export type SubjectResponse = z.infer<typeof subjectResponseSchema>;
