import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import getUrlParam from '@/utils/getUrlParam';
import { createFeedReq } from '@repo/contracts/schemas/Feed/create';
import { syncReactionReqSchema } from '@repo/contracts/schemas/Feed/syncReactionReq';
import { updateFeedReq } from '@repo/contracts/schemas/Feed/update';
import { cursorQueryParamsSchema } from '@repo/contracts/schemas/cursor/cursorQueryParams';
import type { Request, Response } from 'express';
import { FeedService } from './feed.service';

export class FeedController {
  constructor(private readonly service: FeedService) {}

  create = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const input = createFeedReq.parse(req.body);
    const response = await this.service.create({ schoolId, input });
    const statusCode = response.failedCount > 0 ? 207 : 201;
    res.status(statusCode).json({
      message: 'Announcement created successfully',
      data: response,
    });
  };

  update = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const announcementId = getUrlParam(req, 'announcementId');
    const input = updateFeedReq.parse(req.body);
    const response = await this.service.update({ schoolId, input, announcementId });
    const statusCode = response.failedCount > 0 ? 207 : 200;
    res.status(statusCode).json({
      message: 'Announcement updated successfully',
      data: response,
    });
  };

  delete = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const announcementId = getUrlParam(req, 'announcementId');
    await this.service.delete({ schoolId, announcementId });
    res.status(204).send();
  };

  find = async (req: AuthenticatedRequest, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const accountId = req.token.claims.accountId;
    const query = cursorQueryParamsSchema.parse(req.query);
    const response = await this.service.find({ schoolId, accountId, query });
    res.status(200).json({
      message: 'Announcements fetched successfully',
      ...response,
    });
  };

  syncReaction = async (req: AuthenticatedRequest, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const accountId = req.token.claims.accountId;
    const announcementId = getUrlParam(req, 'announcementId');
    const input = syncReactionReqSchema.parse(req.body);
    const response = await this.service.syncReaction({ schoolId, accountId, announcementId, input });
    const statusCode = response.action === 'nothing' ? 204 : 200;
    res.status(statusCode).json({
      message: 'Announcement reaction synced successfully',
      data: response,
    });
  };
}
