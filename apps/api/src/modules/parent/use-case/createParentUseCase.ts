import { prisma } from '@/bootstrap/db.init';
import { AccountService } from '@/modules/accounts/account.service';
import { CreateSimpleUserUseCase } from '@/modules/User/use-cases/createSimpleUser.use-case';
import { UserService } from '@/modules/User/user.service';
import { UserRoleService } from '@/modules/userRoles/userRole.service';
import { TX } from '@/types/prisma/PrismaTransaction';
import { CreateParentRequest } from '@repo/contracts/schemas/parent/createParentRequest';
import { AccountRole, UserRole } from '@repo/db/prisma/enums';
import { ParentService } from '../parent.service';

export class CreateParentUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    private readonly userRoleService: UserRoleService,
    private readonly createSimpleUserUseCase: CreateSimpleUserUseCase,
    private readonly parentService: ParentService,
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

  execute = async (params: { input: CreateParentRequest; schoolId: string }) => {
    const { input, schoolId } = params;
    return await prisma.$transaction(async (tx) => {
      const createdUser = await this.createSimpleUserUseCase.execute(
        {
          input: {
            ...input,
            role: UserRole.PARENT,
          },
          schoolId,
        },
        tx,
      );
      const createdParent = await this.parentService.create({ userId: createdUser.user.id, schoolId }, tx);
      return { user: createdUser.user, parent: createdParent, isAccountExist: createdUser.isAccountExist };
    });
  };
}
