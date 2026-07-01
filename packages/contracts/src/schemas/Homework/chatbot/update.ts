import z from 'zod';
export const updateHomeworkChatbotReqSchema = z.object({
  //TODO: define schema
});

export type UpdateHomeworkChatbotReq = z.infer<typeof updateHomeworkChatbotReqSchema>;
