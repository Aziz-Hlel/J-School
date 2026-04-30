import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { AccountService } from '@/modules/accounts/account.service';
import { CreateSimpleUserRequest } from '@repo/contracts/schemas/user/createSimpleUserRequest';
import { UserService } from './user.service';

type CreateUserParams = {
  payload: CreateSimpleUserRequest;
  schoolId: string;
};

export class UserAppService {
  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
  ) {}

  createSimpleUser = async ({ payload, schoolId }: CreateUserParams) => {
    const { account, type: accountType } = await this.accountService.findOrCreateAccount({
      accountDetails: {
        email: payload.email,
        password: payload.password,
        displayName: `${payload.firstName} ${payload.lastName}`,
      },
    });

    const { user, alreadyExists } = await this.userService.findOrCreateSimpleUser({
      payload,
      accountId: account.id,
      schoolId,
    });
    if (alreadyExists) {
      throw new ConflictError({
        message: 'User already exists',
        internalLog: `User with email ${payload.email} already exists in school ${schoolId}`,
      });
    }

    return {
      message: 'User created successfully',
      user: { id: user.id },
      accountExists: accountType === 'EXISTING',
    };
  };

  getById = async ({ userId, schoolId }: { userId: string; schoolId: string }) => {
    const user = await this.userService.findById(userId, {
      include: { roles: true, account: true, parent: true, teacher: true },
    });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    if (user.schoolId !== schoolId) {
      throw new NotFoundError({
        message: 'User not found',
        internalLog: `User with id ${userId} exists but not in school ${schoolId}`,
      });
    }
    return user;
  };
}
