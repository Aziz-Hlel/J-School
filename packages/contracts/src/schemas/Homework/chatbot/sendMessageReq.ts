import { z } from 'zod';

export const sendHomeworkMessageSchema = z.object({
  content: z.string().trim().min(1, 'Message is required').max(1024, 'Message must be at most 1024 characters long'),
});

export type SendHomeworkMessageRequest = z.infer<typeof sendHomeworkMessageSchema>;
