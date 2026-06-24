import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { AccountService } from '@/modules/accounts/account.service';
import { CreateSimpleUserRequest } from '@repo/contracts/schemas/user/createSimpleUserRequest';
import { UpdateSimpleUserRequest } from '@repo/contracts/schemas/user/updateSimpleUserRequest';
import prisma from '@repo/db';
import { UserMapper } from './user.mapper';
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
    const queryResult = await prisma.user.findUnique({
      where: {
        id: userId,
        schoolId,
      },
      include: { roles: true, account: { select: { email: true, avatar: true } } },
    });

    if (!queryResult) throw new NotFoundError('User not found');

    const userResponse = UserMapper.toUserResponseWithAvatar(queryResult);
    return userResponse;
  };

  updateSimpleUser = async ({
    schoolId,
    userId,
    input,
  }: {
    schoolId: string;
    userId: string;
    input: UpdateSimpleUserRequest;
  }) => {
    return this.userService.updateSimpleUser({ schoolId, userId, input });
  };
}
