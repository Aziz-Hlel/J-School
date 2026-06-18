import { globalMediaService } from '@/media/media.service';
import { toCalendarDate } from '@/utils/dayjs';
import { StudentFullDetailsResponse } from '@repo/contracts/schemas/student/studentFullDetails';
import { StudentResponse } from '@repo/contracts/schemas/student/studentResponse';
import { StudentWithClassroomResponse } from '@repo/contracts/schemas/student/studentWithClassroomResponse';
import { StudentGetPayload } from '@repo/db/prisma/models';
import { ClassroomMapper } from '../classroom/classroom.mapper';
import { ParentMapper } from '../parent/parent.mapper';
import { StudentProfileMapper } from '../studentProfile/studentProfile.mapper';
import studentFullDetailsInclude from './includes/studentFullDetails';

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

  static toFullDetails(
    student: StudentGetPayload<{ include: typeof studentFullDetailsInclude }>,
  ): StudentFullDetailsResponse {
    const teachersMap = new Map<string, any>();
    if (student.classroom && student.classroom.assignments) {
      for (const assignment of student.classroom.assignments) {
        if (assignment.teacher && assignment.teacher.user) {
          const teacherId = assignment.teacher.id;
          if (!teachersMap.has(teacherId)) {
            teachersMap.set(teacherId, {
              id: teacherId,
              firstName: assignment.teacher.user.firstName,
              lastName: assignment.teacher.user.lastName,
              gender: assignment.teacher.user.gender,
              avatar: assignment.teacher.user.account?.avatar
                ? globalMediaService.toMediaRes(assignment.teacher.user.account.avatar)
                : null,
              subjects: [],
            });
          }
          const teacherObj = teachersMap.get(teacherId);
          if (assignment.subject && !teacherObj.subjects.find((s: any) => s.id === assignment.subject.id)) {
            teacherObj.subjects.push({
              id: assignment.subject.id,
              name: {
                ar: assignment.subject.name_ar,
                fr: assignment.subject.name_fr,
                en: assignment.subject.name_en,
              },
              domain: assignment.subject.domain,
            });
          }
        }
      }
    }

    const parents = student.parents?.map((parent) => ParentMapper.toParentResponse(parent.parent));

    return {
      id: student.id,
      uid: student.uid,
      firstName: {
        ar: student.firstName_ar,
        en: student.firstName_en,
      },
      lastName: {
        ar: student.lastName_ar,
        en: student.lastName_en,
      },
      avatar: student.avatar ? globalMediaService.toMediaRes(student.avatar) : null,
      dateOfBirth: toCalendarDate(student.dateOfBirth),
      gender: student.gender,
      status: student.status,
      profile: student.profile ? StudentProfileMapper.toResponse(student.profile) : null,
      classroom: student.classroom ? ClassroomMapper.toResponse(student.classroom) : null,
      parents: parents,
      createdAt: student.createdAt.toISOString(),
      updatedAt: student.updatedAt.toISOString(),
    };
  }
}
