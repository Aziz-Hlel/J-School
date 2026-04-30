import { AccountService } from '../accounts/account.service';
import { OwnerAppService } from './owner.app.service';
import { OwnerController } from './owner.controller';
import { OwnerRepo } from './owner.repo';
import { createRouter } from './owner.route';
import { OwnerService } from './owner.service';

export const createOwnerModule = () => {
  const repo = new OwnerRepo();
  const service = new OwnerService(repo);
  const appService = new OwnerAppService(repo, service);
  const controller = new OwnerController(appService);
  const ownerRouter = createRouter(controller);
  return { ownerRouter, ownerService: service };
};
