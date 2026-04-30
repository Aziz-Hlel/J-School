import { AccountRole } from '@repo/db/prisma/enums';
import { AccountService } from '@/modules/accounts/account.service';
import { faker } from '@faker-js/faker';

export class AccountSeed {
  constructor(private readonly accountService: AccountService) {}

  run = async ({ email, accountRole, password }: { email: string; accountRole?: AccountRole; password?: string }) => {
    const result = await this.accountService.findOrCreateAccount({
      accountDetails: {
        email,
        password: password ?? '12345678',
        displayName: faker.internet.username(),
        role: accountRole ?? faker.helpers.arrayElement(Object.values(AccountRole)),
      },
    });
    return result;
  };
}
