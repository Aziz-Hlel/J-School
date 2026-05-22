import getUrlParam from '@/utils/getUrlParam';
import { createNotification2ReqSchema } from '@repo/contracts/schemas/Notification2/create.req';
import type { Request, Response } from 'express';
import { NotificationService } from './notification.service';

export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  create = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const input = createNotification2ReqSchema.parse(req.body);

    await this.service.create({ input: { ...input, schoolId } });
    res.status(201).json({
      message: 'created successfully',
    });
  };

  update = async (req: Request, res: Response) => {};

  delete = async (req: Request, res: Response) => {};

  findById = async (req: Request, res: Response) => {};
}
