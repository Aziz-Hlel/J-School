import { StudentGetPayload } from '@repo/db/prisma/models';
import { globalMediaService } from '@/media/media.service';
import { toCalendarDateOrNull } from '@/utils/dayjs';
import { StudentResponse } from '@repo/contracts/schemas/student/studentResponse';

export const StudentMapper = {
  toResponse: (student: StudentGetPayload<{ include: { avatar: true } }>): StudentResponse => {
    const avatarResponse = globalMediaService.generateMediaResponse(student.avatar);
    return {
      id: student.id,
      uid: student.uid,
      firstName: {
        en: student.firstName_en,
        ar: student.firstName_ar,
      },
      lastName: {
        en: student.lastName_en,
        ar: student.lastName_ar,
      },
      gender: student.gender,
      dateOfBirth: toCalendarDateOrNull(student.dateOfBirth),
      avatar: avatarResponse,
      status: student.status,
      createdAt: student.createdAt.toISOString(),
      updatedAt: student.updatedAt.toISOString(),
    };
  },
};
