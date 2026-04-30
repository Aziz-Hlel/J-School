import { CreateParentUseCase } from './use-case/createParentUseCase';
import { Request, Response } from 'express';

export class ParentController {
  constructor(private readonly createParentUseCase: CreateParentUseCase) {}

  create = async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await this.createParentUseCase.execute(payload);
    res.status(201).json(result);
  };
}
