import { globalMediaService } from '@/media/media.service';
import { toCalendarDate } from '@/utils/dayjs';
import { StudentResponse } from '@repo/contracts/schemas/student/studentResponse';
import { StudentWithClassroomResponse } from '@repo/contracts/schemas/student/studentWithClassroomResponse';
import { StudentGetPayload } from '@repo/db/prisma/models';
import { ClassroomMapper } from '../classroom/classroom.mapper';

export class StudentMapper {
  static toResponse(student: StudentGetPayload<{ include: { avatar: true } }>): StudentResponse {
    const avatarResponse = globalMediaService.toMediaRes(student.avatar);
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
      dateOfBirth: toCalendarDate(student.dateOfBirth),
      avatar: avatarResponse,
      status: student.status,
      createdAt: student.createdAt.toISOString(),
      updatedAt: student.updatedAt.toISOString(),
    };
  }

  static toResponseWithClassroom(
    student: StudentGetPayload<{ include: { avatar: true; classroom: true } }>,
  ): StudentWithClassroomResponse {
    const avatarResponse = globalMediaService.toMediaRes(student.avatar);
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
      dateOfBirth: toCalendarDate(student.dateOfBirth),
      avatar: avatarResponse,
      status: student.status,
      classroom: student.classroom ? ClassroomMapper.toResponse(student.classroom) : null,
      createdAt: student.createdAt.toISOString(),
      updatedAt: student.updatedAt.toISOString(),
    };
  }

  static toResponse2(
    student: StudentGetPayload<{ include: { avatar: true; classroom: true } }>,
  ): StudentWithClassroomResponse {
    const avatarResponse = globalMediaService.toMediaRes(student.avatar);
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
      dateOfBirth: toCalendarDate(student.dateOfBirth),
      avatar: avatarResponse,
      status: student.status,
      classroom: student.classroom ? ClassroomMapper.toResponse(student.classroom) : null,
      createdAt: student.createdAt.toISOString(),
      updatedAt: student.updatedAt.toISOString(),
    };
  }
}
