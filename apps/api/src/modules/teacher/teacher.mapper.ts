import { globalMediaService } from '@/media/media.service';
import { TeacherResponse } from '@repo/contracts/schemas/teacher/teacherResponse';
import { TeacherShortRes } from '@repo/contracts/schemas/teacher/teacherShortResponse';
import { Prisma } from '@repo/db/prisma/browser';
import { TeacherGetPayload } from '@repo/db/prisma/models';
export class TeacherMapper {
  static toResponse(
    teacher: TeacherGetPayload<{ include: { user: { include: { account: { include: { avatar: true } } } } } }>,
  ): TeacherResponse {
    const avatar = globalMediaService.toMediaRes(teacher.user.account.avatar);
    return {
      id: teacher.id,
      userId: teacher.userId,
      firstName: teacher.user.firstName,
      lastName: teacher.user.lastName,
      email: teacher.user.account.email,
      gender: teacher.user.gender,
      avatar,
      dateOfBirth: teacher.user.dateOfBirth?.toISOString() ?? null,
      phone: teacher.user.phone,
      cin: teacher.user.cin,
      address: teacher.user.address,

      createdAt: teacher.createdAt.toISOString(),
      updatedAt: teacher.updatedAt.toISOString(),
    };
  }

  static toShortRes(
    teacher: TeacherGetPayload<{ include: { user: { include: { account: { include: { avatar: true } } } } } }>,
  ): TeacherShortRes {
    const avatar = globalMediaService.toMediaRes(teacher.user.account.avatar);

    return {
      id: teacher.id,
      firstName: teacher.user.firstName,
      lastName: teacher.user.lastName,
      gender: teacher.user.gender,
      avatar,
    };
  }

  static toTeacherSelect(
    teacher: Prisma.TeacherGetPayload<{
      select: {
        id: true;
        user: {
          select: {
            id: true;
            firstName: true;
            lastName: true;
            gender: true;
            account: {
              select: {
                avatar: true;
              };
            };
          };
        };
      };
    }>,
  ): TeacherShortRes {
    return {
      id: teacher.id,
      firstName: teacher.user.firstName,
      lastName: teacher.user.lastName,
      gender: teacher.user.gender,
      avatar: globalMediaService.toMediaRes(teacher.user.account.avatar),
    };
  }
}
