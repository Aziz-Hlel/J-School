import { HomeworkChatProvider } from '@/llm/homeworkChat.provider';
import { globalLlmProvider } from '@/llm/llm.provider';
import { HomeworkChatbotController } from './homeworkChatbot.controller';
import { createRouter } from './homeworkChatbot.route';
import { HomeworkChatbotService } from './homeworkChatbot.service';

export const HomeworkChatbotModule = () => {
  const homeworkChatProvider = new HomeworkChatProvider(globalLlmProvider);
  const service = new HomeworkChatbotService(homeworkChatProvider);
  const controller = new HomeworkChatbotController(service);
  const homeworkChatbotRouter = createRouter(controller);
  return {
    homeworkChatbotRouter,
  };
};
