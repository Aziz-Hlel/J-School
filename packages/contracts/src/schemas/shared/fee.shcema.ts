import { z } from 'zod';

export const globalFeeSchema = {
  name: z
    .string()
    .trim()
    .max(255)
    .transform((v) => (v === '' ? undefined : v))
    .optional(),
  studentId: z.uuid(),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
};
