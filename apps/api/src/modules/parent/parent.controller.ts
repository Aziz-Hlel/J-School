import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import getUrlParam from '@/utils/getUrlParam';
import { createParentRequestSchema } from '@repo/contracts/schemas/parent/createParentRequest';
import { parentsQueryParams } from '@repo/contracts/schemas/parent/queryParams';
import { updateParentReqSchema } from '@repo/contracts/schemas/parent/updateParentRequest';
import { Request, Response } from 'express';
import { ParentService } from './parent.service';
import { CreateParentUseCase } from './use-case/createParentUseCase';

export class ParentController {
  constructor(
    private readonly parentService: ParentService,
    private readonly createParentUseCase: CreateParentUseCase,
  ) {}

  create = async (req: AuthenticatedRequest, res: Response) => {
    const payload = createParentRequestSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId');
    const result = await this.createParentUseCase.execute({ input: payload, schoolId });
    res.status(201).json(result);
  };

  findById = async (req: Request, res: Response) => {
    const parentId = getUrlParam(req, 'parentId');
    const schoolId = getUrlParam(req, 'schoolId');

    const result = await this.parentService.findById({ parentId, schoolId });
    res.status(200).json(result);
  };

  findAll = async (req: Request, res: Response) => {
    const queryParams = parentsQueryParams.schema.parse(req.query);
    const schoolId = getUrlParam(req, 'schoolId');

    const result = await this.parentService.findAll({ queryParams, schoolId });
    res.status(200).json(result);
  };

  update = async (req: AuthenticatedRequest, res: Response) => {
    const input = updateParentReqSchema.parse(req.body);
    const parentId = getUrlParam(req, 'parentId');
    const schoolId = getUrlParam(req, 'schoolId');
    const result = await this.parentService.update({ input, parentId, schoolId });
    res.status(200).json({ data: result, message: 'Parent updated successfully' });
  };
}
