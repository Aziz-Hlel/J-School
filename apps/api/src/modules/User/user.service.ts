import { UserRepo } from './user.repo';
import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { TX } from '@/types/prisma/PrismaTransaction';
import { UpdateSimpleUserRequest } from '@repo/contracts/schemas/user/updateSimpleUserRequest';
import { UserInclude } from '@repo/db/prisma/models';
import { CreateUserInput } from './types/createUserInput';
import { CreateSimpleUserRequest } from '@repo/contracts/schemas/user/createSimpleUserRequest';
import { RepoKnownErrors } from '@/err/repo/DbError';
import { Prisma } from '@repo/db/prisma/client';
import prisma from '@repo/db';
import { userRolesStaff } from '@repo/contracts/types/enums/meta/userRoleMeta';

export class UserService {
  constructor(private readonly userRepo: UserRepo) {}

  create_V2 = async (
    params: { input: Omit<CreateUserInput, 'role'>; schoolId: string; accountId: string },
    tx?: TX,
  ) => {
    const { input, schoolId, accountId } = params;
    try {
      return await this.userRepo.create_V2({ input, schoolId, accountId }, tx);
    } catch (error) {
      if (error instanceof RepoKnownErrors.ConflictError) {
        throw new ConflictError({
          message: 'User already exists',
          internalLog: `User with email ${input.email} already exists in school ${schoolId}`,
        });
      }
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({
          message: 'Failed to create user',
          internalLog: `account with id ${accountId} or school with id ${schoolId} not found`,
        });
      }
      throw error;
    }
  };

  createSimpleUser = async (params: { payload: CreateUserInput; accountId: string; schoolId: string }, tx?: TX) => {
    const { payload, accountId, schoolId } = params;
    const user = await this.userRepo.findByAccountIdSchoolId({ accountId, schoolId });
    if (user) {
      throw new ConflictError({
        message: 'User already exists',
        internalLog: `User with email ${payload.email} already exists in school ${schoolId}`,
      });
    }
    const createdUser = await this.userRepo.createUserWithSimpleRole({ schema: payload, accountId, schoolId }, tx);
    return createdUser;
  };

  updateSimpleUser = async ({
    input,
    userId,
    schoolId,
  }: {
    input: UpdateSimpleUserRequest;
    userId: string;
    schoolId: string;
  }) => {
    const user = await this.userRepo.findById(userId, {});
    if (!user) {
      throw new NotFoundError('User not found');
    }
    if (user.schoolId !== schoolId) {
      throw new NotFoundError({
        message: 'User not found',
        internalLog: `User with id ${userId} exists but not in school ${schoolId}`,
      });
    }
    const updatedUser = await this.userRepo.updateSimpleUser({ input, userId });
    return updatedUser;
  };

  findOrCreateSimpleUser = async (params: {
    payload: CreateSimpleUserRequest;
    accountId: string;
    schoolId: string;
  }) => {
    const { payload, accountId, schoolId } = params;
    const user = await this.userRepo.findByAccountIdSchoolId({ accountId, schoolId });
    if (user) {
      return { user, alreadyExists: true };
    }
    const createdUser = await this.userRepo.createUserWithSimpleRole({ schema: payload, accountId, schoolId });
    return { user: createdUser, alreadyExists: false };
  };

  findByAccountId = async ({ accountId, schoolId }: { accountId: string; schoolId: string }) => {
    const user = await this.userRepo.findByAccountIdSchoolId({ accountId, schoolId });
    return user;
  };

  findById = async <T extends UserInclude>(userId: string, { include }: { include: T } = { include: {} as T }) => {
    const user = await this.userRepo.findById(userId, include);
    return user;
  };

  findAllStaff = async <T extends Prisma.UserInclude>(
    params: {
      skip: number;
      take: number;
      where: Prisma.UserWhereInput;
      orderBy: Prisma.UserOrderByWithRelationInput;
      schoolId: string;
    },
    include: T,
  ) => {
    const { skip, take, where, orderBy, schoolId } = params;
    const users = prisma.user.findMany({
      skip,
      take,
      where: { ...where, schoolId, roles: { some: { role: { in: userRolesStaff } } } },
      include,
      orderBy,
    });
    const usersCount = prisma.user.count({
      where: { ...where, schoolId, roles: { some: { role: { in: userRolesStaff } } } },
    });

    const [content, totalElements] = await Promise.all([users, usersCount]);

    return { content, totalElements };
  };
}
