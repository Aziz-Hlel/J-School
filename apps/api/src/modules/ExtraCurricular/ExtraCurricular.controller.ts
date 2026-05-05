import { ExtraCurricularService } from './ExtraCurricular.service';
import getUrlParam from '@/utils/getUrlParam';
import { createExtraCurricularRequestSchema } from '@repo/contracts/schemas/extraCurricular/createExtraCurricularRequest';
import { updateExtraCurricularReqSchema } from '@repo/contracts/schemas/extraCurricular/updateExtraCurricularReq';
import { Request, Response } from 'express';

export class ExtraCurricularController {
  constructor(private readonly extraCurricularService: ExtraCurricularService) {}

  create = async (req: Request, res: Response) => {
    const input = createExtraCurricularRequestSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const data = await this.extraCurricularService.create({ input, schoolId });
    res.status(201).json({
      message: 'Extra curricular created successfully',
      data,
    });
  };

  update = async (req: Request, res: Response) => {
    const input = updateExtraCurricularReqSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const extraCurricularId = getUrlParam(req, 'extraCurricularId', { uuid: true });
    const data = await this.extraCurricularService.update({ input, schoolId, extraCurricularId });
    res.status(200).json({
      message: 'Extra curricular updated successfully',
      data,
    });
  };

  delete = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const extraCurricularId = getUrlParam(req, 'extraCurricularId', { uuid: true });
    await this.extraCurricularService.delete({ schoolId, extraCurricularId });
    res.status(200).json({
      message: 'Extra curricular deleted successfully',
    });
  };
}
