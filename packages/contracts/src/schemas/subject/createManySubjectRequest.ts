import z from 'zod';
import { globalSubjectSchema } from '../shared/subject.schema';

export const createManySubjectRequestSchema = z.object({
  grade: globalSubjectSchema.grade,
  subjects: z
    .array(
      z.object({
        name: z.object({
          en: globalSubjectSchema.name_en,
          fr: globalSubjectSchema.name_fr,
          ar: globalSubjectSchema.name_ar,
        }),
        hoursPerWeek: globalSubjectSchema.hoursPerWeek,
        domain: globalSubjectSchema.domain,
      }),
    )
    .min(1, 'At least one subject is required')
    .max(20, 'At most 20 subjects are allowed'),
});

export type CreateManySubjectRequest = z.infer<typeof createManySubjectRequestSchema>;
