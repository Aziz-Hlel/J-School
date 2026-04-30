import z from 'zod';

export const globalParentSchema = {
  emergencyPhone: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .or(z.literal(''))
    .or(z.null())
    .transform((val) => (val === '' ? null : val)),
};
