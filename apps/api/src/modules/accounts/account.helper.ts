import { prisma } from '@/bootstrap/db.init';
import { TX } from '@/types/prisma/PrismaTransaction';

export class AccountHelper {
  constructor() {}

  isAccountHasOwner = async ({ accountId, tx }: { accountId: string; tx?: TX }) => {
    const orm = tx || prisma;
    const account = await orm.account.findUnique({
      where: {
        id: accountId,
      },
      select: {
        owner: true,
      },
    });

    return !!account?.owner;
  };
}
