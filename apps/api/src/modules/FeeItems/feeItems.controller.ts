import type { Request, Response } from 'express';
import { FeeItemsService } from './feeItems.service';
import getUrlParam from '@/utils/getUrlParam';
import { createFeeItemsReqSchema } from '@repo/contracts/schemas/FeeItems/create';
import { updateFeeItemsReqSchema } from '@repo/contracts/schemas/FeeItems/update';

export class FeeItemsController {
  constructor(private readonly service: FeeItemsService) {}

  create = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const feeId = getUrlParam(req, 'feeId');
    const input = createFeeItemsReqSchema.parse(req.body);
    const data = await this.service.create({ input, schoolId, feeId });
    res.status(201).json({ data });
  };

  update = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const feeItemId = getUrlParam(req, 'feeItemId');
    const input = updateFeeItemsReqSchema.parse(req.body);
    const data = await this.service.update({ input, schoolId, feeItemId });
    res.status(200).json({ data });
  };

  delete = async (req: Request, res: Response) => {
    const feeItemId = getUrlParam(req, 'feeItemId');
    await this.service.delete({ feeItemId });
    res.status(204).send();
  };
}
