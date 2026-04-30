import { AccountService } from '../accounts/account.service';
import { CreateSimpleUserUseCase } from './use-cases/createSimpleUser.use-case';
import { UserAppService } from './user.app.service';
import { UserController } from './user.controller';
import { UserRepo } from './user.repo';
import createUserRouter from './user.route';
import { UserService } from './user.service';

// const createAuthModule = (userInternalService: UserInternalService) => {
//   const service = new AuthService(userInternalService);
//   const controller = new AuthController(service);
//   const authRouter = createAuthRouter(controller);

//   return { authRouter };
// };

const createUserModule = ({ accountService }: { accountService: AccountService }) => {
  const repo = new UserRepo();
  const service = new UserService(repo);
  const createSimpleUserUseCase = new CreateSimpleUserUseCase(service, accountService);
  const appService = new UserAppService(service, accountService);
  const controller = new UserController(appService);
  const userRouter = createUserRouter(controller);
  return { userRouter, userService: service, userRepo: repo, createSimpleUserUseCase };
};

export { createUserModule };
