import { globalMediaService } from '@/media/media.service';
import { StaffResponse } from '@repo/contracts/schemas/staff/staffResponse';
import { UserGetPayload } from '@repo/db/prisma/models';
import { UserMapper } from '../User/user.mapper';

export class StaffMapper {
  static toResponse(
    staff: UserGetPayload<{ include: { account: { include: { avatar: true } }; roles: true } }>,
  ): StaffResponse {
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
      avatar: globalMediaService.toMediaRes(staff.account.avatar),

      createdAt: staff.createdAt.toISOString(),
      updatedAt: staff.updatedAt.toISOString(),
    };
  }
}
