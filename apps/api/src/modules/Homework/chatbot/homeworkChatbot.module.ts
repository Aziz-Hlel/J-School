import { HomeworkChatbotController } from './homeworkChatbot.controller';
import { createRouter } from './homeworkChatbot.route';
import { HomeworkChatbotService } from './homeworkChatbot.service';

export const HomeworkChatbotModule = () => {
  const service = new HomeworkChatbotService();
  const controller = new HomeworkChatbotController(service);
  const homeworkChatbotRouter = createRouter(controller);
  return {
    homeworkChatbotRouter,
  };
};
