import { globalMediaService } from '@/media/media.service';
import { TeacherResponse } from '@repo/contracts/schemas/teacher/teacherResponse';
import { TeacherShortRes } from '@repo/contracts/schemas/teacher/teacherShortResponse';
import { TeacherGetPayload } from '@repo/db/prisma/models';
export class TeacherMapper {
  static toResponse(
    teacher: TeacherGetPayload<{ include: { user: { include: { account: { include: { avatar: true } } } } } }>,
  ): TeacherResponse {
    const avatar = globalMediaService.toMediaRes(teacher.user.account.avatar);
    return {
      id: teacher.id,
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
}
