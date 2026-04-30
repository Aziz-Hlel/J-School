import z from 'zod';

export const globalExamSchema = {
  durationInMin: z.number().int().positive().max(240),
  name_en: z.string(),
  name_fr: z.string(),
  name_ar: z.string(),
};

export type GlobalExamSchema = z.infer<typeof globalExamSchema>;
