import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import getUrlParam from '@/utils/getUrlParam';
import { notificationCountCursorSchema } from '@repo/contracts/schemas/Notification2/notificationCountQueryParam';
import { notificationCursorSchema } from '@repo/contracts/schemas/Notification2/notificationQueryParam';
import { notificationMarkAsReadSchema } from '@repo/contracts/schemas/Notification2/notificationReadSchema';
import type { Response } from 'express';
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

  find = async (req: AuthenticatedRequest, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const cursorParam = notificationCursorSchema.parse(req.query);
    const accountId = req.token.claims.accountId;
    const response = await this.service.find({ cursorParam, schoolId, accountId });
    res.json({ data: response });
  };

  getCount = async (req: AuthenticatedRequest, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const cursorParam = notificationCountCursorSchema.parse(req.query);
    const accountId = req.token.claims.accountId;
    const response = await this.service.getCount({ cursorParam, schoolId, accountId });
    res.json({ data: response });
  };

  markAsRead = async (req: AuthenticatedRequest, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const input = notificationMarkAsReadSchema.parse(req.query);
    const accountId = req.token.claims.accountId;
    const response = await this.service.markAsRead({ input, schoolId, accountId });
    res.json({ data: response });
  };
}
