import { RedisKeys } from '@/cache/keys/cache.keys';
import { globalCacheService } from '@/cache/service/cache.service';
import type { SendHomeworkMessageRequest } from '@repo/contracts/schemas/Homework/chatbot/sendMessageReq';

export class HomeworkChatbotService {
  constructor() {}
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

    messages.push({ role: 'user', content: 'Hello!' });
  };
}
