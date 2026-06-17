import { presignedUrlRequestSchema } from '@repo/contracts/schemas/media/PresignedUrlRequest';
import { PresignedUrlResponse } from '@repo/contracts/schemas/media/PresignedUrlResponse';
import { Request, Response } from 'express';
import { IMediaService } from './media.service';
import { presignedUrlRequestListSchema } from '@repo/contracts/schemas/media/PresignedUrlRequestList';

export class MediaController {
  constructor(private readonly mediaService: IMediaService) {}

  getPresignedUrl = async (req: Request, res: Response<PresignedUrlResponse>) => {
    const schema = presignedUrlRequestSchema.parse(req.body);
    const presignedUrlResponse = await this.mediaService.getPresignedUrl(schema);
    res.json(presignedUrlResponse);
  };

  getPresignedUrls = async (req: Request, res: Response<PresignedUrlResponse[]>) => {
    const schema = presignedUrlRequestListSchema.parse(req.body);
    const presignedUrlResponse = await this.mediaService.getPresignedUrls(schema);
    res.json(presignedUrlResponse);
  };
}
