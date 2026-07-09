import { globalMediaService } from '@/media/media.service';
import { toCalendarDate } from '@/utils/dayjs';
import { ParentResponse } from '@repo/contracts/schemas/parent/parentResponse';
import { SelectParentsRes } from '@repo/contracts/schemas/school/selectParentsResponse';
import { ParentGetPayload } from '@repo/db/prisma/models';
import includeUserAndAvatar from './includes/includeUserAndAvatar';

export class ParentMapper {
  static toParentResponse(parent: ParentGetPayload<{ include: typeof includeUserAndAvatar }>): ParentResponse {
    const avatar = globalMediaService.toMediaRes(parent.user.account.avatar);
    return {
      id: parent.id,
      userId: parent.userId,
      firstName: parent.user.firstName,
      lastName: parent.user.lastName,
      email: parent.user.account.email,
      gender: parent.user.gender,
      dateOfBirth: toCalendarDate(parent.user.dateOfBirth),
      phone: parent.user.phone,
      cin: parent.user.cin,
      address: parent.user.address,
      avatar: avatar,

      createdAt: parent.user.createdAt.toISOString(),
      updatedAt: parent.user.updatedAt.toISOString(),
    };
  }

  static toSelectParents(
    parent: ParentGetPayload<{
      select: {
        id: true;
        user: {
          select: {
            firstName: true;
            lastName: true;
            cin: true;
            phone: true;
            account: {
              select: {
                email: true;
              };
            };
          };
        };
      };
    }>,
  ): SelectParentsRes {
    return {
      id: parent.id,
      firstName: parent.user.firstName,
      lastName: parent.user.lastName,
      email: parent.user.account.email,
      cin: parent.user.cin,
      phone: parent.user.phone,
    };
  }
}
