import { AccountService } from '../accounts/account.service';
import { CreateSimpleUserUseCase } from '../User/use-cases/createSimpleUser.use-case';
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
  createSimpleUserUseCase: CreateSimpleUserUseCase;
}) => {
  const { accountService, userRoleService, userService, createSimpleUserUseCase } = params;
  const parentRepo = new ParentRepo();
  const parentService = new ParentService(parentRepo, userService);
  const createParentUseCase = new CreateParentUseCase(
    userService,
    accountService,
    userRoleService,
    createSimpleUserUseCase,
    parentService,
  );
  const parentController = new ParentController(parentService, createParentUseCase);
  const parentRouter = createParentRouter(parentController);

  return { parentService, parentRepo, parentRouter };
};
