import z from 'zod';
import { globalSubjectSchema } from '../shared/subject.schema';
import { globalExamSchema } from '../shared/exam.schema';

export const createManyWithExamsRequestSchema = z.object({
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
        exams: z
          .array(
            z.object({
              name: z.object({
                en: globalExamSchema.name_en,
                fr: globalExamSchema.name_fr,
                ar: globalExamSchema.name_ar,
              }),
              durationInMin: globalExamSchema.durationInMin,
            }),
          )
          .min(1, 'At least one exam is required')
          .max(10, 'At most 10 exams are allowed'),
      }),
    )
    .min(1, 'At least one subject is required')
    .max(20, 'At most 20 subjects are allowed'),
});

export type CreateManyWithExamsRequest = z.infer<typeof createManyWithExamsRequestSchema>;
