import { prisma } from '@/bootstrap/db.init';
import { DatabaseError } from '@/err/service/customErrors';
import type { TX } from '@/types/prisma/PrismaTransaction';
import { parseCalendarDate } from '@/utils/dayjs';
import { UpdateSimpleUserRequest } from '@repo/contracts/schemas/user/updateSimpleUserRequest';
import { Prisma } from '@repo/db/prisma/client';
import type { UserGetPayload, UserInclude } from '@repo/db/prisma/models';
import { CreateUserInput } from './types/createUserInput';

export class UserRepo {
  create_V2 = async (
    params: { input: Omit<CreateUserInput, 'role'>; schoolId: string; accountId: string },
    tx?: TX,
  ) => {
    try {
      const { input, schoolId, accountId } = params;
      const client = tx || prisma;
      return await client.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          gender: input.gender,
          dateOfBirth: parseCalendarDate(input.dateOfBirth),
          phone: input.phone,
          cin: input.cin,
          address: input.address,

          accountId,
          schoolId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (!(error instanceof Error)) throw error;
        throw new DatabaseError({ message: 'Failed to create user', cause: error });
      }
      throw error;
    }
  };
  findByAccountIdSchoolId = async <T extends UserInclude>({
    accountId,
    schoolId,
    include,
  }: {
    accountId: string;
    schoolId: string;
    include?: T;
  }) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          accountId_schoolId: {
            accountId,
            schoolId,
          },
        },
        include,
      });
      return user as UserGetPayload<{ include: T }> | null;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (!(error instanceof Error)) throw error;
        throw new DatabaseError({ message: 'Failed to find user', cause: error });
      }
      throw error;
    }
  };

  createUserWithSimpleRole = async (
    {
      schema,
      schoolId,
      accountId,
    }: {
      schema: CreateUserInput;
      schoolId: string;
      accountId: string;
    },
    tx?: TX,
  ) => {
    try {
      const client = tx || prisma;
      const user = await client.user.create({
        data: {
          firstName: schema.firstName,
          lastName: schema.lastName,
          gender: schema.gender,
          dateOfBirth: schema.dateOfBirth ? new Date(schema.dateOfBirth) : null,
          phone: schema.phone,
          cin: schema.cin,
          address: schema.address,
          roles: {
            create: {
              role: schema.role,
            },
          },
          accountId,
          schoolId,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (!(error instanceof Error)) throw error;
        throw new DatabaseError({ message: 'Failed to create user', cause: error });
      }
      throw error;
    }
  };

  updateSimpleUser = async ({ input, userId }: { input: UpdateSimpleUserRequest; userId: string }, tx?: TX) => {
    try {
      const client = tx || prisma;
      const user = await client.user.update({
        where: {
          id: userId,
        },
        data: {
          ...input,
          dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (!(error instanceof Error)) throw error;
        throw new DatabaseError({ message: 'Failed to update user', cause: error });
      }
      throw error;
    }
  };

  findById = async <T extends UserInclude>(userId: string, include: T) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include,
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (!(error instanceof Error)) throw error;
        throw new DatabaseError({ message: 'Failed to find user', cause: error });
      }
      throw error;
    }
  };

  findByEmailAndSchoolId = async <T extends UserInclude>(
    { email, schoolId }: { email: string; schoolId: string },
    include: T,
  ) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          schoolId,
          account: {
            email,
          },
        },
        include,
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (!(error instanceof Error)) throw error;
        throw new DatabaseError({ message: 'Failed to find user', cause: error });
      }
      throw error;
    }
  };
}
