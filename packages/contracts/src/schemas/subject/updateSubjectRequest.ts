import z from 'zod';
import { globalSubjectSchema } from '../shared/subject.schema';

export const updateSubjectRequestSchema = z.object({
  name: z.object({
    en: globalSubjectSchema.name_en,
    fr: globalSubjectSchema.name_fr,
    ar: globalSubjectSchema.name_ar,
  }),
  // grade: globalSubjectSchema.grade, // * removed since i went to "only bulk create subjects at init" route
  hoursPerWeek: globalSubjectSchema.hoursPerWeek,
  domain: globalSubjectSchema.domain,
});
export type UpdateSubjectRequest = z.infer<typeof updateSubjectRequestSchema>;
