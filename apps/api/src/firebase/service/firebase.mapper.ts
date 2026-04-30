// import { Account } from '@repo/db/prisma/client';
import { Claims } from '@/types/token/Claims';
import { Account } from '@repo/db/prisma/client';

export class FirebaseMapper {
  static toNewAccountClaims({ account }: { account: Account }): Claims {
    return {
      accountId: account.id,
      accountRole: account.role,
    };
  }

  static toClaims({ account }: { account: Account }): Claims {
    return {
      accountId: account.id,
      accountRole: account.role,
    };
  }
}
