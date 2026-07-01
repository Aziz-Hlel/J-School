import z from 'zod';
export const createHomeworkChatbotReqSchema = z.object({
  //TODO: define schema
});

export type CreateHomeworkChatbotReq = z.infer<typeof createHomeworkChatbotReqSchema>;
