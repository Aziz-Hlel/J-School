import { DecodedIdTokenWithClaims } from '@/types/auth/DecodedTokenWithClaims';
import { CreateOwnerRequest } from '@repo/contracts/schemas/owner/createOwnerRequest';
import { prisma } from '@/bootstrap/db.init';
import { ConflictError } from '@/err/service/customErrors';
import { OwnerRepo } from './owner.repo';
import { UpdateOwnerRequest } from '@repo/contracts/schemas/owner/updateOwnerRequest';
import { OwnerService } from './owner.service';

export class OwnerAppService {
  constructor(
    private readonly ownerRepo: OwnerRepo,
    private readonly ownerService: OwnerService,
  ) {}

  create = async ({ schema, token }: { schema: CreateOwnerRequest; token: DecodedIdTokenWithClaims }) => {
    console.log('accountid ', token.claims.accountId);
    const accountHasOwner = await this.ownerService.existsByAccountId({ accountId: token.claims.accountId });
    if (accountHasOwner) {
      throw new ConflictError('Account already registered as school owner');
    }
    const owner = await this.ownerService.create({ schema, accountId: token.claims.accountId });

    return {
      message: 'Owner created successfully',
      owner: {
        id: owner.id,
      },
    };
  };

  update = async ({ schema, token }: { schema: UpdateOwnerRequest; token: DecodedIdTokenWithClaims }) => {
    const accountHasOwner = await this.ownerService.existsByAccountId({ accountId: token.claims.accountId });
    if (!accountHasOwner) {
      throw new ConflictError('Account not registered as school owner');
    }

    await this.ownerRepo.update({
      schema,
      accountId: token.claims.accountId,
    });

    return {
      message: 'Owner updated successfully',
    };
  };
}
