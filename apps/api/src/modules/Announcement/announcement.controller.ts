import type { Request, Response } from 'express';
import { AnnouncementService } from './announcement.service';
import getUrlParam from '@/utils/getUrlParam';
import { createAnnouncmentReq } from '@repo/contracts/schemas/Announcement/create';
import { updateAnnouncementReq } from '@repo/contracts/schemas/Announcement/update';
import { announcementQueryParamSchema } from '@repo/contracts/schemas/Announcement/announcementQueryParam';
import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import { syncReactionReqSchema } from '@repo/contracts/schemas/Announcement/syncReactionReq';

export class AnnouncementController {
  constructor(private readonly service: AnnouncementService) {}

  create = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const input = createAnnouncmentReq.parse(req.body);
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
    const input = updateAnnouncementReq.parse(req.body);
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
    const query = announcementQueryParamSchema.parse(req.query);
    const response = await this.service.find({ schoolId, accountId, query });
    res.status(200).json({
      message: 'Announcements fetched successfully',
      data: response,
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
