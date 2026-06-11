import { AccountGetPayload, AccountInclude } from '@repo/db/prisma/models';
// * fix the erros above, i think you should use other types since those are from files not recommened to import from , not sure though
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
