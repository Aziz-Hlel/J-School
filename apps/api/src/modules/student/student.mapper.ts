import { globalMediaService } from '@/media/media.service';
import { toCalendarDate } from '@/utils/dayjs';
import { ClassroomResponse } from '@repo/contracts/schemas/classroom/classResponse';
import { StudentResponse } from '@repo/contracts/schemas/student/studentResponse';
import { StudentWithClassroomResponse } from '@repo/contracts/schemas/student/studentWithClassroomResponse';
import { StudentProfileResponse } from '@repo/contracts/schemas/studentProfile/studentProfileResponse';
import { StudentGetPayload } from '@repo/db/prisma/models';
import { ClassroomMapper } from '../classroom/classroom.mapper';
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

  static toFullDetailsRes(student: StudentGetPayload<{ include: typeof studentFullDetailsInclude }>): {
    id: string;
    uid: string | null;
    firstName: {
      ar: string | null;
      en: string | null;
    };
    lastName: {
      ar: string | null;
      en: string | null;
    };
    avatar: any;
    dateOfBirth: string | null;
    gender: string;
    status: string;
    schoolId: string;
    classroomId: string | null;
    avatarId: string | null;
    createdAt: string;
    profile: StudentProfileResponse | null;
    classroom: ClassroomResponse | null;
    teachers: {
      id: string;
      firstName: string;
      lastName: string;
      gender: string;
      avatar: any;
      subjects: {
        id: string;
        name: {
          ar: string | null;
          fr: string | null;
          en: string | null;
        };
        domain: string;
      }[];
    }[];
    parents: {
      id: string;
      firstName: string;
      lastName: string;
      gender: string;
      avatar: any;
      phone: string | null;
      address: string | null;
      cin: string | null;
      dateOfBirth: string | null;
    }[];
  } {
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

    const parentsMap = new Map<string, any>();
    if (student.parents) {
      for (const parent of student.parents) {
        if (parent.parent && parent.parent.user) {
          const parentId = parent.parent.id;
          if (!parentsMap.has(parentId)) {
            parentsMap.set(parentId, {
              id: parentId,
              firstName: parent.parent.user.firstName,
              lastName: parent.parent.user.lastName,
              gender: parent.parent.user.gender,
              avatar: parent.parent.user.account?.avatar
                ? globalMediaService.toMediaRes(parent.parent.user.account.avatar)
                : null,
              phone: parent.parent.user.phone,
              address: parent.parent.user.address,
              cin: parent.parent.user.cin,
              dateOfBirth: parent.parent.user.dateOfBirth ? toCalendarDate(parent.parent.user.dateOfBirth) : null,
            });
          }
        }
      }
    }

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
      schoolId: student.schoolId,
      classroomId: student.classroomId,
      avatarId: student.avatarId,
      createdAt: student.createdAt.toISOString(),
      profile: student.profile ? StudentProfileMapper.toResponse(student.profile) : null,
      classroom: student.classroom ? ClassroomMapper.toResponse(student.classroom) : null,
      teachers: Array.from(teachersMap.values()),
      parents: Array.from(parentsMap.values()),
    };
  }
}
