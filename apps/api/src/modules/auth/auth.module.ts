import { AccountService } from '../accounts/account.service';
import { AuthAppService } from './auth.app.service';
import { AuthController } from './auth.controller';
import createRouter from './auth.route';

export const authModule = (accountService: AccountService) => {
  const service = new AuthAppService(accountService);
  const controller = new AuthController(service);
  const authRouter = createRouter(controller);
  return { authRouter };
};
