import type { Request, Response } from 'express';
import { HomeworkService } from './homework.service';
import getUrlParam from '@/utils/getUrlParam';

export class HomeworkController {
  constructor(private readonly service: HomeworkService) {}

  create = async (req: Request, res: Response) => {};

  update = async (req: Request, res: Response) => {};

  delete = async (req: Request, res: Response) => {};

  findById = async (req: Request, res: Response) => {};
}
