import { prisma } from '@/bootstrap/db.init';
import { SchoolPlan } from '@repo/db/prisma/enums';
import { SchoolCreateInput } from '@repo/db/prisma/models';
import { faker } from '@faker-js/faker';
import { generateFakeMediaInstance } from '../helper/generateSeedMedia';

export class SchoolSeed {
  constructor() {}

  private generateFakeSchoolInstance = ({ ownerId }: { ownerId: string }): SchoolCreateInput => {
    return {
      nameEn: faker.company.name(),
      nameFr: faker.company.name(),
      nameAr: faker.company.name(),
      address: faker.location.streetAddress(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      logo: {
        create: generateFakeMediaInstance(),
      },
      website: faker.internet.url(),
      description: faker.lorem.sentence(),
      plan: faker.helpers.arrayElement(Object.values(SchoolPlan)),
      slug: faker.lorem.slug(),
      owner: {
        connect: {
          id: ownerId,
        },
      },

      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    };
  };

  run = async ({ ownerId }: { ownerId: string }) => {
    const fakePayload = this.generateFakeSchoolInstance({ ownerId });
    const result = await prisma.school.upsert({
      where: {
        ownerId,
      },
      create: fakePayload,
      update: {},
    });
    return result;
  };
}
