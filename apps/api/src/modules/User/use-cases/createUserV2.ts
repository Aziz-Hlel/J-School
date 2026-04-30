import { prisma } from '@/bootstrap/db.init';
import { AccountService } from '@/modules/accounts/account.service';
import { UserRoleService } from '@/modules/userRoles/userRole.service';
import { TX } from '@/types/prisma/PrismaTransaction';
import { CreateUserInput } from '../types/createUserInput';
import { UserService } from '../user.service';
import { AccountRole } from '@repo/db/prisma/enums';

/**
 * @deprecated use createUserV3 instead
 */
export class CreateUserV2UseCase {
  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    private readonly userRoleService: UserRoleService,
  ) {}

  private run = async (params: { input: CreateUserInput; schoolId: string; authId: string }, tx: TX) => {
    const { input, schoolId, authId } = params;
    try {
      const { account } = await this.accountService.findOrCreateAccount_V2(
        {
          accountDetails: {
            email: input.email,
            authId: authId,
            role: AccountRole.USER,
          },
        },
        tx,
      );

      const user = await this.userService.create_V2({ input, schoolId, accountId: account.id }, tx);

      await this.userRoleService.grantRole_V2({ userId: user.id, role: input.role }, tx);

      return { user, account };
    } catch (error) {
      throw error;
    }
  };

  execute = async (params: { input: CreateUserInput; schoolId: string; authId: string }, tx?: TX) => {
    if (tx) return await this.run(params, tx);

    return await prisma.$transaction((tx) => {
      return this.run(params, tx);
    });
  };
}
