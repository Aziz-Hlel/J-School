import z from 'zod';

export const globalAccountSchema = {
  email: z.email(),
  password: z.string(),
};

export type GlobalAccountSchema = z.infer<typeof globalAccountSchema>;
