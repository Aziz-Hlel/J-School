import type { Request, Response } from 'express';
import { FeesService } from './fees.service';
import getUrlParam from '@/utils/getUrlParam';

export class FeesController {
  constructor(private readonly service: FeesService) {}

  create = async (req: Request, res: Response) => {};

  update = async (req: Request, res: Response) => {};

  delete = async (req: Request, res: Response) => {};

  findById = async (req: Request, res: Response) => {};
}
