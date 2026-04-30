import { AccountAppService } from './account.app.service';
import { AccountController } from './account.controller';
import { AccountRepo } from './account.repo';
import createRouter from './account.route';
import { AccountService } from './account.service';

export const AccountModule = () => {
  const repo = new AccountRepo();
  const accountService = new AccountService(repo);
  const accountAppService = new AccountAppService(repo, accountService);
  const controller = new AccountController(accountAppService);
  const accountRouter = createRouter(controller);
  return { accountRouter, accountService };
};
