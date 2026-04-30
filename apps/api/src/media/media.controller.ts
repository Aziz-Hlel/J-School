import { presignedUrlRequestSchema } from '@repo/contracts/schemas/media/PresignedUrlRequest';
import { Request, Response } from 'express';
import { PresignedUrlResponse } from '@repo/contracts/schemas/media/PresignedUrlResponse';
import { IMediaService } from './media.service';

export class MediaController {
  constructor(private readonly mediaService: IMediaService) {}

  getPresignedUrl = async (req: Request, res: Response<PresignedUrlResponse>) => {
    const schema = presignedUrlRequestSchema.parse(req.body);
    const presignedUrlResponse = await this.mediaService.getPresignedUrl(schema);
    res.json(presignedUrlResponse);
  };
}
