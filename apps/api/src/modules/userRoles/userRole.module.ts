import { UserRoleAppService } from './userRole.app.service';
import { UserRoleController } from './userRole.controller';
import { UserRoleRepo } from './userRole.repo';
import { createRouter } from './userRole.route';
import { UserRoleService } from './userRole.service';

export const createUserRoleModule = () => {
  const userRoleRepo = new UserRoleRepo();
  const userRoleService = new UserRoleService(userRoleRepo);
  const userRoleAppService = new UserRoleAppService(userRoleService);
  const userRoleController = new UserRoleController(userRoleAppService);
  const userRoleRouter = createRouter(userRoleController);
  return {
    userRoleService,
    userRoleRouter,
  };
};
