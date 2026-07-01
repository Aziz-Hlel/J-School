import z from 'zod';
export const homeworkChatbotResponseSchema = z.object({
  //TODO: define schema
});

export type HomeworkChatbotResponse = z.infer<typeof homeworkChatbotResponseSchema>;
