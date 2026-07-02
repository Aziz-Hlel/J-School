import { AccountGetPayload, AccountInclude } from '@repo/db/prisma/models';
type AccountIncludeConstraint = AccountInclude;

export const accountInclude = {
  avatar: true,
  owner: {
    include: {
      school: true,
    },
  },
  users: {
    include: {
      roles: true,
      school: true,
      teacher: true,
      parent: {
        include: {
          students: {
            include: {
              student: {
                include: {
                  avatar: true,
                  classroom: true,
                },
              },
            },
          },
        },
      },
    },
  },
} as const satisfies AccountIncludeConstraint;

export type AccountIncludeType = typeof accountInclude;

export type AccountEntityRequest = AccountGetPayload<{ include: typeof accountInclude }>;
