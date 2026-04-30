import z from 'zod';

export const sendContactUsRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters long')
    .max(255, 'Name must be at most 255 characters long'),
  email: z.email(),
  subject: z
    .string()
    .trim()
    .min(3, 'Subject must be at least 3 characters long')
    .max(255, 'Subject must be at most 255 characters long'),
  message: z
    .string()
    .trim()
    .min(5, 'Message must be at least 5 characters long')
    .max(1000, 'Message must be at most 1000 characters long'),
});

export type SendContactUsRequest = z.infer<typeof sendContactUsRequestSchema>;
