import getUrlParam from '@/utils/getUrlParam';
import { notificationCursorSchema } from '@repo/contracts/schemas/Notification2/notificationQueryParam';
import type { Request, Response } from 'express';
import { NotificationService } from './notification.service';

export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  // create = async (req: Request, res: Response) => {
  //   const schoolId = getUrlParam(req, 'schoolId');
  //   const input = createNotification2ReqSchema.parse(req.body);

  //   await this.service.create({ input: { ...input, schoolId } });
  //   res.status(201).json({
  //     message: 'created successfully',
  //   });
  // };

  find = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const cursorParam = notificationCursorSchema.parse(req.query);

    const response = await this.service.find({ cursorParam, schoolId });
    res.json({ data: response });
  };
}
