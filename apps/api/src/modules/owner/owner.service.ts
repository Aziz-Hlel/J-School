import { CreateOwnerRequest } from '@repo/contracts/schemas/owner/createOwnerRequest';
import { OwnerRepo } from './owner.repo';

export class OwnerService {
  constructor(private readonly ownerRepo: OwnerRepo) {}

  create = async ({ schema, accountId }: { schema: CreateOwnerRequest; accountId: string }) => {
    const owner = await this.ownerRepo.create({ schema, accountId });
    return owner;
  };

  findOrCreateOwner = async ({ schema, accountId }: { schema: CreateOwnerRequest; accountId: string }) => {
    const existingOwner = await this.ownerRepo.getByAccountId({ accountId });
    if (existingOwner) return { owner: existingOwner, type: 'EXISTING' };

    const owner = await this.ownerRepo.create({ schema, accountId });
    return { owner, type: 'NEW' };
  };

  findByAccountId = async (accountId: string) => {
    const owner = await this.ownerRepo.getByAccountId({ accountId });
    return owner;
  };

  existsByAccountId = async ({ accountId }: { accountId: string }) => {
    const exists = await this.ownerRepo.existsByAccountId({ accountId });
    return exists;
  };
}
