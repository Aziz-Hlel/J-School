import { prisma } from '@/bootstrap/db.init';
import { RepoError } from '@/err/repo/DbError';
import { genUuid } from '@/seeds/helper/generateUuid';
import { TX } from '@/types/prisma/PrismaTransaction';
import { AccountRole } from '@repo/db/prisma/enums';
import { AccountInclude } from '@repo/db/prisma/models';

export class AccountRepo {
  isAccountExists = async ({ authId }: { authId: string }) => {
    const account = await prisma.account.findUnique({
      where: {
        authId,
      },
    });

    return !!account;
  };

  getById = async <T extends AccountInclude>({ id, include }: { id: string; include: T }) => {
    const account = await prisma.account.findUnique({
      where: {
        id,
      },
      include,
    });

    return account;
  };

  hasOwner = async ({ accountId }: { accountId: string }) => {
    const exists = await prisma.account.findFirst({
      where: {
        id: accountId,
        owner: { isNot: null },
      },
      select: { id: true },
    });

    return !!exists;
  };

  findByAuthId = async <T extends AccountInclude>({ authId, include }: { authId: string; include: T }) => {
    const account = await prisma.account.findUnique({
      where: {
        authId,
      },
      include,
    });

    return account;
  };

  createAccount = async (
    {
      authId,
      email,
      role = AccountRole.USER,
      provider,
      isEmailVerified,
    }: {
      authId: string;
      email: string | undefined;
      role?: AccountRole;
      provider?: string;
      isEmailVerified?: boolean;
    },
    tx?: TX,
  ) => {
    const client = tx || prisma;

    const getUuid = (email?: string) => {
      const emailToUuid = {
        'tigana137@gmail.com': genUuid('tigana137@gmail.com'),
        'parent1@fake.com': genUuid('parent1@fake.com'),
        'teacher1@fake.com': genUuid('teacher1@fake.com'),
        'director1@fake.com': genUuid('director1@fake.com'),
        'manager1@fake.com': genUuid('manager1@fake.com'),
      };
      if (email && email in emailToUuid) return emailToUuid[email as keyof typeof emailToUuid];

      return undefined;
    };

    try {
      const account = await client.account.create({
        data: {
          id: getUuid(email), // ! remove this later, it was just for 7ama to integrate the uuid in one signal to test the feature
          authId,
          email,
          role: role ?? AccountRole.USER,
          provider: provider ?? 'password',
          isEmailVerified: isEmailVerified ?? false,
        },
      });

      return account;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  getAccountByEmail = async ({ email, tx }: { email: string; tx?: TX }) => {
    const client = tx || prisma;
    const account = await client.account.findUnique({
      where: {
        email,
      },
    });

    return account;
  };
}
