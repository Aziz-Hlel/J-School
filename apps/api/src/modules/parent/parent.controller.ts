import getUrlParam from '@/utils/getUrlParam';
import { parentsQueryParams } from '@repo/contracts/schemas/parent/queryParams';
import { Request, Response } from 'express';
import { ParentService } from './parent.service';
import { CreateParentUseCase } from './use-case/createParentUseCase';

export class ParentController {
  constructor(
    private readonly parentService: ParentService,
    private readonly createParentUseCase: CreateParentUseCase,
  ) {}

  create = async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await this.createParentUseCase.execute(payload);
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
}
