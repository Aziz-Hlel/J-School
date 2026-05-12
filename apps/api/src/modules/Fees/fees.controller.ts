import getUrlParam from '@/utils/getUrlParam';
import { createFeesReqSchema } from '@repo/contracts/schemas/Fees/create';
import { updateFeesReqSchema } from '@repo/contracts/schemas/Fees/update';
import type { Request, Response } from 'express';
import { FeesService } from './fees.service';

export class FeesController {
  constructor(private readonly service: FeesService) {}

  create = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const input = createFeesReqSchema.parse(req.body);
    const data = await this.service.create({ input, schoolId });
    res.status(201).json({ data });
  };

  update = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const feeId = getUrlParam(req, 'feeId');
    const input = updateFeesReqSchema.parse(req.body);
    const data = await this.service.update({ input, schoolId, feeId });
    res.status(200).json({ data });
  };

  findById = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const feeId = getUrlParam(req, 'feeId');
    const data = await this.service.findById({ schoolId, feeId });
    res.status(200).json({ data });
  };

  delete = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const feeId = getUrlParam(req, 'feeId');
    await this.service.delete({ schoolId, feeId });
    res.status(204).send();
  };
}
