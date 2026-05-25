import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import { CreateAccountSchema } from '@repo/contracts/schemas/account/CreateAccountDto';
import { Request, Response } from 'express';
import { AuthAppService } from './auth.app.service';

export class AuthController {
  constructor(private readonly authAppService: AuthAppService) {}

  authWithPassword = async (req: Request, res: Response) => {
    const { token } = CreateAccountSchema.parse(req.body);
    const user = await this.authAppService.authWithPassword(token);
    res.status(200).json({ data: user });
  };

  authWithProvider = async (req: Request, res: Response) => {
    const { token } = CreateAccountSchema.parse(req.body);
    const user = await this.authAppService.authWithProvider(token);
    res.status(200).json({ data: user });
  };

  me = async (req: AuthenticatedRequest, res: Response) => {
    const user = await this.authAppService.me(req.token);
    res.status(200).json({ data: user });
  };
}
