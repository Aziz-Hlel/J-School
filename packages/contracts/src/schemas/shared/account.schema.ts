import z from 'zod';

export const globalAccountSchema = {
  email: z.email(),
  password: z
    .string()
    .trim()
    .min(6, 'Password must be at least 6 characters long')
    .max(50, 'Password must be at most 50 characters long'),
};

export type GlobalAccountSchema = z.infer<typeof globalAccountSchema>;
