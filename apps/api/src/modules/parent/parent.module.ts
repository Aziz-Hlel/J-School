import { AccountService } from '../accounts/account.service';
import { UserService } from '../User/user.service';
import { UserRoleService } from '../userRoles/userRole.service';
import { ParentController } from './parent.controller';
import { ParentRepo } from './parent.repo';
import createParentRouter from './parent.route';
import { ParentService } from './parent.service';
import { CreateParentUseCase } from './use-case/createParentUseCase';

export const ParentModule = (params: {
  accountService: AccountService;
  userRoleService: UserRoleService;
  userService: UserService;
}) => {
  const { accountService, userRoleService, userService } = params;
  const parentRepo = new ParentRepo();
  const parentService = new ParentService(parentRepo);
  const createParentUseCase = new CreateParentUseCase(userService, accountService, userRoleService);
  const parentController = new ParentController(parentService, createParentUseCase);
  const parentRouter = createParentRouter(parentController);

  return { parentService, parentRepo, parentRouter };
};
