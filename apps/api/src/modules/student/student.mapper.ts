import { globalMediaService } from '@/media/media.service';
import { toCalendarDate } from '@/utils/dayjs';
import { ClassroomResponse } from '@repo/contracts/schemas/classroom/classResponse';
import { StudentResponse } from '@repo/contracts/schemas/student/studentResponse';
import { StudentWithClassroomResponse } from '@repo/contracts/schemas/student/studentWithClassroomResponse';
import { StudentProfileResponse } from '@repo/contracts/schemas/studentProfile/studentProfileResponse';
import { UserFullResponse } from '@repo/contracts/schemas/user/UserFullResponse';
import { StudentGetPayload } from '@repo/db/prisma/models';
import { ClassroomMapper } from '../classroom/classroom.mapper';
import studentFullDetailsInclude from './includes/studentFullDetails';
import { StudentProfileMapper } from '../studentProfile/studentProfile.mapper';
import { UserMapper } from '../User/user.mapper';

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

  static toFullDetailsRes(student: StudentGetPayload<{ include: typeof studentFullDetailsInclude }>): {
    student: StudentResponse;
    profile: StudentProfileResponse | null;
    classroom: ClassroomResponse | null;
    parents: UserFullResponse[];
  } {
    return {
      student: StudentMapper.toResponse(student),
      profile: student.profile ? StudentProfileMapper.toResponse(student.profile) : null,
      classroom: student.classroom ? ClassroomMapper.toResponse(student.classroom) : null,
      // parents: student.parents.map((parent) => UserMapper.toFullUserResponse(parent.parent.)),
    };
  }
}
