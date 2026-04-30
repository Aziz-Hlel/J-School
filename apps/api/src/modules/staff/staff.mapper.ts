import { UserGetPayload } from '@repo/db/prisma/models';
import { StaffResponse } from '@repo/contracts/schemas/staff/staffResponse';
import { UserMapper } from '../User/user.mapper';

export class StaffMapper {
  static toResponse(staff: UserGetPayload<{ include: { account: true; roles: true } }>): StaffResponse {
    const rolesResponse = UserMapper.toUserRoles(staff.roles);
    return {
      id: staff.id,
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.account.email,
      gender: staff.gender,
      dateOfBirth: staff.dateOfBirth?.toISOString() || null,
      phone: staff.phone,
      cin: staff.cin,
      address: staff.address,
      roles: rolesResponse,

      createdAt: staff.createdAt.toISOString(),
      updatedAt: staff.updatedAt.toISOString(),
    };
  }
}
