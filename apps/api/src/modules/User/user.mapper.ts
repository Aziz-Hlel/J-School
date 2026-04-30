import { UserRoles } from '@repo/db/prisma/client';
import { UserGetPayload } from '@repo/db/prisma/models';
import { UserFullResponse } from '@repo/contracts/schemas/user/UserFullResponse';
import { UserRoleResponse } from '@repo/contracts/schemas/user/UserRolesResponse';
import { UserSimpleResponse } from '@repo/contracts/schemas/user/UserSimpleResponse';
import { AccountMapper } from '../accounts/account.mapper';

export class UserMapper {
  static toUserRoles(roles: UserRoles[]): UserRoleResponse[] {
    return roles.map((roleInstance) => {
      return {
        id: roleInstance.id,
        role: roleInstance.role,
        createdAt: roleInstance.createdAt.toISOString(),
      };
    });
  }
  static toUserResponse(user: UserGetPayload<{ include: { roles: true } }>): UserSimpleResponse {
    const rolesResponse = this.toUserRoles(user.roles);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString() : null,
      phone: user.phone,
      address: user.address,
      cin: user.cin,
      roles: rolesResponse,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  static toFullUserResponse(
    user: UserGetPayload<{
      include: { account: { include: { avatar: true } }; parent: true; roles: true; school: true; teacher: true };
    }>,
  ): UserFullResponse {
    const accountResponse = AccountMapper.toResponseWithAvatar(user.account);
    const userResponse = this.toUserResponse(user);
    return {
      account: accountResponse,
      user: userResponse,
    };
  }
}
