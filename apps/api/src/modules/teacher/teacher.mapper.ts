import { TeacherGetPayload } from '@repo/db/prisma/models';
import { globalMediaService } from '@/media/media.service';
import { TeacherResponse } from '@repo/contracts/schemas/teacher/teacherResponse';

export class TeacherMapper {
  static toResponse(
    teacher: TeacherGetPayload<{ include: { user: { include: { account: { include: { avatar: true } } } } } }>,
  ): TeacherResponse {
    const avatar = globalMediaService.generateMediaResponse(teacher.user.account.avatar);
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
}
