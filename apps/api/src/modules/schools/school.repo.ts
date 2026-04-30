import { prisma } from '@/bootstrap/db.init';
import { ConflictError } from '@/err/service/customErrors';
import { isUniqueConstraintError } from '@/utils/prismaError';
import { UpdateSchoolRequest } from '@repo/contracts/schemas/school/updateSchoolRequest';
import { CreateSchoolPayload } from './types/createSchoolPayload';
import type { TX } from '@/types/prisma/PrismaTransaction';
import { Prisma } from '@repo/db/prisma/client';
// import { Prisma } from '@repo/db/prisma/client';
// import { Prisma } from '@repo/db/prisma/client';

export class SchoolRepo {
  create = async ({ payload, ownerId, tx }: { payload: CreateSchoolPayload; ownerId: string; tx?: TX }) => {
    const orm = tx ?? prisma;
    try {
      const school = await orm.school.create({
        data: {
          ...payload,
          ownerId,
        },
      });

      return school;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (isUniqueConstraintError(error)) {
          throw new ConflictError({
            message: 'School already exists',
            clientMessage: 'School already exists',
            cause: error,
          });
        }
      }
      throw error;
    }
  };

  update = async ({ payload, schoolId, tx }: { payload: UpdateSchoolRequest; schoolId: string; tx?: TX }) => {
    const orm = tx ?? prisma;
    try {
      const school = await orm.school.update({
        where: {
          id: schoolId,
        },
        data: payload,
      });
      return school;
    } catch (error) {
      throw error;
    }
  };

  getById = async ({ schoolId, include }: { schoolId: string; include: Prisma.SchoolInclude }) => {
    try {
      const school = await prisma.school.findUnique({
        where: {
          id: schoolId,
        },
        include,
      });
      return school;
    } catch (error) {
      throw error;
    }
  };

  getByAccountId = async ({
    accountId,
    tx,
    include,
  }: {
    accountId: string;
    tx?: TX;
    include: Prisma.SchoolInclude;
  }) => {
    const orm = tx ?? prisma;
    try {
      const school = await orm.school.findFirst({
        where: {
          owner: {
            accountId: accountId,
          },
        },
        include,
      });
      return school;
    } catch (error) {
      throw error;
    }
  };

  getByOwnerId = async ({ ownerId, include }: { ownerId: string; include: Prisma.SchoolInclude }) => {
    try {
      const school = await prisma.school.findUnique({
        where: {
          ownerId,
        },
        include,
      });
      return school;
    } catch (error) {
      throw error;
    }
  };

  existByOwnerId = async (ownerId: string) => {
    const exists = await prisma.school.findUnique({
      where: { ownerId },
      select: { id: true },
    });

    return !!exists;
  };
}
