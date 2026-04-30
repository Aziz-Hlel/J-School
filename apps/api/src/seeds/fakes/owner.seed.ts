import { OwnerService } from '@/modules/owner/owner.service';
import { faker } from '@faker-js/faker';

export class OwnerSeed {
  constructor(private readonly ownerService: OwnerService) {}

  run = async ({ accountId }: { accountId: string }) => {
    const result = await this.ownerService.findOrCreateOwner({
      schema: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
      },
      accountId,
    });
    return result;
  };
}
