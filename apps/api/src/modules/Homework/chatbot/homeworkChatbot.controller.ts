import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import getUrlParam from '@/utils/getUrlParam';
import { sendHomeworkMessageSchema } from '@repo/contracts/schemas/Homework/chatbot/sendMessageReq';
import type { Request, Response } from 'express';
import { HomeworkChatbotService } from './homeworkChatbot.service';

export class HomeworkChatbotController {
  constructor(private readonly service: HomeworkChatbotService) {}

  sendMessage = async (req: AuthenticatedRequest, res: Response) => {
    const homeworkId = getUrlParam(req, 'homeworkId');
    const schoolId = getUrlParam(req, 'schoolId');
    const accountId = req.token.claims.accountId;
    const input = sendHomeworkMessageSchema.parse(req.body);
    const response = await this.service.sendMessage({
      homeworkId,
      schoolId,
      accountId,
      input,
    });

    res.json({ data: response });
  };

  create = async (req: Request, res: Response) => {};

  update = async (req: Request, res: Response) => {};

  delete = async (req: Request, res: Response) => {};

  findById = async (req: Request, res: Response) => {};
}
