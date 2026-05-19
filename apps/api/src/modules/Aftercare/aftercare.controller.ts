import type { Request, Response } from 'express';
import { AftercareService } from './aftercare.service';
import getUrlParam from '@/utils/getUrlParam';
import { syncAftercareReqSchema } from '@repo/contracts/schemas/Aftercare/sync';
import { syncAftercareQueryParamSchema } from '@repo/contracts/schemas/Aftercare/syncQueryParam';

export class AftercareController {
  constructor(private readonly service: AftercareService) {}

  sync = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const input = syncAftercareReqSchema.parse(req.body);
    await this.service.sync({ schoolId, input });
    res.status(201).json({ message: 'Aftercare synced successfully' });
  };

  findByDate = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const input = syncAftercareQueryParamSchema.parse(req.query);
    const data = await this.service.findByDate({ schoolId, input });
    res.status(200).json({
      message: 'Aftercare found successfully',
      data,
    });
  };
}
