import { prisma } from '@/bootstrap/db.init';
import { firebaseAuthService } from '@/firebase/service/firebase.auth.service';
import { firebaseUserService } from '@/firebase/service/firebase.user.service';
import { AccountRole } from '@repo/db/prisma/client';
import { AccountService } from '@/modules/accounts/account.service';
import { TX } from '@/types/prisma/PrismaTransaction';
import { CreateUserInput } from '../types/createUserInput';
import { UserService } from '../user.service';

export class CreateSimpleUserUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
  ) {}

  private run = async (params: { input: CreateUserInput; schoolId: string }, tx: TX) => {
    const { userRecord, type: authType } = await firebaseUserService.findOrCreateAccount({
      email: params.input.email,
      password: params.input.password,
    });

    // ! implementation is still incomplete, it doesnt take in account all cases , what if the auth acocunt is created but the db account is not
    const { account } = await this.accountService.findOrCreateAccount_V2(
      {
        accountDetails: {
          email: params.input.email,
          authId: userRecord.uid,
          role: AccountRole.USER,
        },
      },
      tx,
    );

    const user = await this.userService.createSimpleUser(
      {
        payload: params.input,
        schoolId: params.schoolId,
        accountId: account.id,
      },
      tx,
    );

    await firebaseAuthService.setAccountClaims({
      authId: userRecord.uid,
      claims: { accountId: account.id, accountRole: account.role },
    });
    // ! missing the case where the firebase throw an error in either create or setting claims phase , you d need a rollback mechanism and see if the auth account is new then you delete it otherwise keep it
    return { user, account, userRecord, isAccountExist: authType === 'EXISTING' };
  };

  execute = async (params: { input: CreateUserInput; schoolId: string }, tx?: TX) => {
    if (tx) return await this.run(params, tx);

    return await prisma.$transaction((tx) => {
      return this.run(params, tx);
    });
  };
}
