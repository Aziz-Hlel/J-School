import { prisma } from '@/bootstrap/db.init';
import { DatabaseError } from '@/err/service/customErrors';
import { TX } from '@/types/prisma/PrismaTransaction';
import { CreateOwnerRequest } from '@repo/contracts/schemas/owner/createOwnerRequest';
import { UpdateOwnerRequest } from '@repo/contracts/schemas/owner/updateOwnerRequest';

export class OwnerRepo {
  create = async ({ schema, accountId, tx }: { schema: CreateOwnerRequest; accountId: string; tx?: TX }) => {
    const orm = tx ?? prisma;
    console.log(schema);
    console.log(accountId);
    try {
      const owner = await orm.owner.create({
        data: {
          ...schema,
          accountId,
        },
      });
      return owner;
    } catch (error: unknown) {
      if (!(error instanceof Error)) throw error;
      throw new DatabaseError({ message: 'Failed to create owner', cause: error });
    }
  };

  update = async ({ schema, accountId, tx }: { schema: UpdateOwnerRequest; accountId: string; tx?: TX }) => {
    const orm = tx ?? prisma;
    try {
      const owner = await orm.owner.update({
        where: {
          accountId,
        },
        data: {
          ...schema,
        },
      });
      return owner;
    } catch (error: unknown) {
      if (!(error instanceof Error)) throw error;
      throw new DatabaseError({ message: 'Failed to update owner', cause: error });
    }
  };

  getByAccountId = async ({ accountId }: { accountId: string }) => {
    try {
      const owner = await prisma.owner.findUnique({
        where: {
          accountId,
        },
      });
      return owner;
    } catch (error: unknown) {
      if (!(error instanceof Error)) throw error;
      throw new DatabaseError({ message: 'Failed to get owner', cause: error });
    }
  };

  existsByAccountId = async ({ accountId }: { accountId: string }) => {
    try {
      const exists = await prisma.owner.findUnique({
        where: {
          accountId,
        },
        select: { id: true },
      });
      return !!exists;
    } catch (error: unknown) {
      if (!(error instanceof Error)) throw error;
      throw new DatabaseError({ message: 'Failed to check if owner exists', cause: error });
    }
  };
}
