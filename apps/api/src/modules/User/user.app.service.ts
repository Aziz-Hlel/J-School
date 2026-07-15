import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { firebaseUserService } from '@/firebase/service/firebase.user.service';
import { AccountService } from '@/modules/accounts/account.service';
import { CreateSimpleUserRequest } from '@repo/contracts/schemas/user/createSimpleUserRequest';
import { UpdatePasswordRequest } from '@repo/contracts/schemas/user/updatePassword';
import { UpdateSimpleUserRequest } from '@repo/contracts/schemas/user/updateSimpleUserRequest';
import { UpdateUserRolesReq } from '@repo/contracts/schemas/user/updateUserRolesReq';
import { UserRoleResponse } from '@repo/contracts/schemas/user/UserRolesResponse';
import prisma from '@repo/db';
import { UserRole } from '@repo/db/prisma/enums';
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';

type CreateUserParams = {
  payload: CreateSimpleUserRequest;
  schoolId: string;
};

export class UserAppService {
  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
  ) {}

  createSimpleUser = async ({ payload, schoolId }: CreateUserParams) => {
    const { account, type: accountType } = await this.accountService.findOrCreateAccount({
      accountDetails: {
        email: payload.email,
        password: payload.password,
        displayName: `${payload.firstName} ${payload.lastName}`,
      },
    });

    const { user, alreadyExists } = await this.userService.findOrCreateSimpleUser({
      payload,
      accountId: account.id,
      schoolId,
    });
    if (alreadyExists) {
      throw new ConflictError({
        message: 'User already exists',
        internalLog: `User with email ${payload.email} already exists in school ${schoolId}`,
      });
    }

    return {
      message: 'User created successfully',
      user: { id: user.id },
      accountExists: accountType === 'EXISTING',
    };
  };

  getById = async ({ userId, schoolId }: { userId: string; schoolId: string }) => {
    const queryResult = await prisma.user.findUnique({
      where: {
        id: userId,
        schoolId,
      },
      include: { roles: true, account: { select: { email: true, avatar: true } } },
    });

    if (!queryResult) throw new NotFoundError('User not found');

    const userResponse = UserMapper.toUserResponseWithAvatar(queryResult);
    return userResponse;
  };

  updateSimpleUser = async ({
    schoolId,
    userId,
    input,
  }: {
    schoolId: string;
    userId: string;
    input: UpdateSimpleUserRequest;
  }) => {
    return this.userService.updateSimpleUser({ schoolId, userId, input });
  };

  getUserRoles = async (userId: string) => {
    console.log('rab id ,', userId);
    const roles = await prisma.userRoles.findMany({
      where: { userId },
    });
    console.log('rab roles', roles.toString());
    const rolesResponse: UserRoleResponse[] = roles.map((role) => ({
      id: role.id,
      role: role.role,
      createdAt: role.createdAt.toISOString(),
    }));

    return rolesResponse;
  };

  updateUserRoles = async (params: { userId: string; input: UpdateUserRolesReq }) => {
    const { userId, input } = params;

    const userRoles = await prisma.userRoles.findMany({
      where: { userId },
    });

    const currentUserRoles = userRoles.map((r) => r.role);

    const rolesToAdd = input.roles.filter((role) => !currentUserRoles.includes(role));
    const rolesToDelete = currentUserRoles.filter((userRole) => !input.roles.includes(userRole));

    await prisma.$transaction(async (tx) => {
      if (rolesToDelete.includes(UserRole.TEACHER)) {
        await tx.teacher.delete({
          where: {
            userId: userId,
          },
        });
      }
      if (rolesToAdd.includes(UserRole.TEACHER)) {
        await tx.teacher.create({
          data: {
            userId: userId,
          },
        });
      }
      if (rolesToDelete.includes(UserRole.PARENT)) {
        await tx.parent.delete({
          where: {
            userId: userId,
          },
        });
      }
      if (rolesToAdd.includes(UserRole.PARENT)) {
        await tx.parent.create({
          data: {
            userId: userId,
          },
        });
      }

      await prisma.userRoles.createMany({
        data: rolesToAdd.map((role) => ({ userId, role })),
      });
      await prisma.userRoles.deleteMany({
        where: { userId, role: { in: rolesToDelete.map((role) => role) } },
      });
    });
  };

  deleteUser = async ({ userId, schoolId }: { userId: string; schoolId: string }) => {
    await prisma.user.delete({ where: { id: userId, schoolId } });
    return true;
  };

  updatePassword = async ({ userId, input }: { userId: string; input: UpdatePasswordRequest }) => {
    const userAuthIdQuery = await prisma.user.findUnique({
      where: { id: userId },
      select: { account: { select: { authId: true } } },
    });

    if (!userAuthIdQuery?.account?.authId) throw new NotFoundError('User not found');

    const authId = userAuthIdQuery.account.authId;
    await firebaseUserService.updateUserPassword(authId, input.password);
    return true;
  };
}
