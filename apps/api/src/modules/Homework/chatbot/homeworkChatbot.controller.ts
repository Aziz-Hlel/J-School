import type { Request, Response } from 'express';
import { HomeworkChatbotService } from './homeworkChatbot.service';
import getUrlParam from '@/utils/getUrlParam';

export class HomeworkChatbotController {
  constructor(private readonly service: HomeworkChatbotService) {}

  create = async (req: Request, res: Response) => {};

  update = async (req: Request, res: Response) => {};

  delete = async (req: Request, res: Response) => {};

  findById = async (req: Request, res: Response) => {};
}
