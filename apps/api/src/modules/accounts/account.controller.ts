import { Request, Response } from 'express';
import { AccountAppService } from './account.app.service';
import { CreateAccountSchema } from '@repo/contracts/schemas/account/CreateAccountDto';

export class AccountController {
  constructor(private readonly accountAppService: AccountAppService) {}

  createAdminWithPassword = async (req: Request, res: Response) => {
    const { token } = CreateAccountSchema.parse(req.body);
    const user = await this.accountAppService.createAdminWithPassword(token);
    res.status(201).json(user);
  };
}
