import z from 'zod';
import { ClassGrade, SubjectDomain } from '../../types/enums/enums';

export const globalSubjectSchema = {
  name_en: z.string(),
  name_fr: z.string(),
  name_ar: z.string(),
  grade: z.enum(ClassGrade),
  domain: z.enum(SubjectDomain),
  hoursPerWeek: z.number().int().positive().min(1).max(10),
};

export type GlobalSubjectSchema = z.infer<typeof globalSubjectSchema>;
