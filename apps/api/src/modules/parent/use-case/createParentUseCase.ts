import { prisma } from '@/bootstrap/db.init';
import { AccountRole, UserRole } from '@repo/db/prisma/enums';
import { AccountService } from '@/modules/accounts/account.service';
import { UserService } from '@/modules/User/user.service';
import { UserRoleService } from '@/modules/userRoles/userRole.service';
import { TX } from '@/types/prisma/PrismaTransaction';
import { CreateParentRequest } from '@repo/contracts/schemas/parent/createParentRequest';

export class CreateParentUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    private readonly userRoleService: UserRoleService,
  ) {}

  private run = async (params: { input: CreateParentRequest; schoolId: string; authId: string }, tx: TX) => {
    const { input, schoolId, authId } = params;
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

    await this.userRoleService.grantRole_V2({ userId: user.id, role: UserRole.PARENT }, tx);

    return user;
  };

  execute = async (params: { input: CreateParentRequest; schoolId: string; authId: string }, tx?: TX) => {
    if (tx) return await this.run(params, tx);

    return await prisma.$transaction((tx) => {
      return this.run(params, tx);
    });
  };
}
