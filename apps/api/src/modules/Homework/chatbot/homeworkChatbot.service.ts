import { RedisKeys } from '@/cache/keys/cache.keys';
import { globalCacheService } from '@/cache/service/cache.service';
import { HomeworkChatProvider } from '@/llm/homeworkChat.provider';
import type { SendHomeworkMessageRequest } from '@repo/contracts/schemas/Homework/chatbot/sendMessageReq';
import prisma from '@repo/db';

export class HomeworkChatbotService {
  constructor(private readonly chatbot: HomeworkChatProvider) {}
  create = async () => {};
  update = async () => {};
  delete = async () => {};
  find = async () => {};

  sendMessage = async (params: {
    homeworkId: string;
    schoolId: string;
    accountId: string;
    input: SendHomeworkMessageRequest;
  }) => {
    const { homeworkId, schoolId, accountId, input } = params;
    const key = RedisKeys.homeworkChatbot.genKey(accountId, homeworkId);
    const rawHistory = await globalCacheService.get({ key });
    const messages = rawHistory ? JSON.parse(rawHistory) : [];

    messages.push({ role: 'user', content: input.content });

    const homeworkExtractedText = await prisma.homework.findUnique({
      where: { id: homeworkId, schoolId },
      select: { extractedText: true },
    });

    const response = await this.chatbot.sendMessage({
      conversationHistory: messages,
      extractedText: homeworkExtractedText?.extractedText ?? {},
    });

    if (response) {
      messages.push({ role: 'assistant', content: response });
    }
    globalCacheService.set({ key, value: JSON.stringify(messages), ttlSeconds: 60 * 60 * 24 });
    return response;
  };

  findHistory = async (params: { homeworkId: string; accountId: string }) => {
    const { homeworkId, accountId } = params;
    const key = RedisKeys.homeworkChatbot.genKey(accountId, homeworkId);
    const rawHistory = await globalCacheService.get({ key });
    const messages = rawHistory ? JSON.parse(rawHistory) : [];
    return messages;
  };
}
