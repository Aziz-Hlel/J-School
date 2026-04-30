import { Request, Response } from 'express';
import { OwnerAppService } from './owner.app.service';
import { createOwnerRequestSchema } from '@repo/contracts/schemas/owner/createOwnerRequest';
import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';

export class OwnerController {
  constructor(private readonly ownerService: OwnerAppService) {}

  create = async (req: AuthenticatedRequest, res: Response) => {
    const schema = createOwnerRequestSchema.parse(req.body);
    const token = req.token;
    const response = await this.ownerService.create({ schema, token });
    res.status(201).json(response);
  };
}
