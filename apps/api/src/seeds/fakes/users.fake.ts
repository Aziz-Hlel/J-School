import { prisma } from '@/bootstrap/db.init';
import { Gender, UserStatus } from '@repo/db/prisma/enums';
import { UserCreateInput } from '@repo/db/prisma/models';
import { TX } from '@/types/prisma/PrismaTransaction';
import { faker } from '@faker-js/faker';

export class UserSeed {
  constructor() {}

  generateFakeSimpleUser = ({ accountId, schoolId }: { accountId: string; schoolId: string }): UserCreateInput => {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      gender: faker.helpers.arrayElement(Object.values(Gender)),
      dateOfBirth: faker.date.past(),
      phone: faker.phone.number(),
      cin: faker.string.numeric(8),
      address: faker.location.streetAddress(),
      status: faker.helpers.arrayElement(Object.values(UserStatus)),

      account: {
        connect: {
          id: accountId,
        },
      },
      school: {
        connect: {
          id: schoolId,
        },
      },

      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };
  };

  run = async (params: { accountId: string; schoolId: string }, tx?: TX) => {
    const { accountId, schoolId } = params;
    const client = tx ?? prisma;
    const user = this.generateFakeSimpleUser({ accountId, schoolId });
    const createdUser = await client.user.upsert({
      where: {
        accountId_schoolId: {
          accountId,
          schoolId,
        },
      },
      create: user,
      update: {},
    });
    return createdUser;
  };
}
