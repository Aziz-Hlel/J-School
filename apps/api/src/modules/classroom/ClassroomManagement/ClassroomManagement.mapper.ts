import { globalMediaService } from '@/media/media.service';
import { toTime } from '@/utils/dayjs';
import type { ClassroomExamScheduleResponse } from '@repo/contracts/schemas/classroom/management/ClassroomExamSchedulesResponse';
import type { ClassroomSubjectsWithTeachersResponse } from '@repo/contracts/schemas/classroom/management/ClassroomSubjectsWithTeachers';
import { Prisma } from '@repo/db/prisma/client';
import { getSubjectsWithTeachersSelect } from './ClassroomManagement.service';

export class ClassroomManagementMapper {
  static toClassroomSubjectsWithTeachersResponse(
    assignments: Prisma.AssignmentGetPayload<{ select: typeof getSubjectsWithTeachersSelect }>[],
  ): ClassroomSubjectsWithTeachersResponse[] {
    return assignments.map((assignment) => {
      return {
        id: assignment.subject.id,
        assignmentId: assignment.id,
        name: {
          en: assignment.subject.name_en,
          fr: assignment.subject.name_fr,
          ar: assignment.subject.name_ar,
        },
        grade: assignment.subject.grade,
        hoursPerWeek: assignment.subject.hoursPerWeek,
        domain: assignment.subject.domain,
        teacher: assignment.teacher
          ? {
              id: assignment.teacher?.user.id,
              firstName: assignment.teacher?.user.firstName,
              lastName: assignment.teacher?.user.lastName,
              gender: assignment.teacher?.user.gender,
              avatar: globalMediaService.toMediaRes(assignment.teacher?.user.account?.avatar),
            }
          : null,
      };
    });
  }

  static toExamScheduleResponse(
    examSchedule: Prisma.ExamScheduleGetPayload<{
      include: {
        exam: { include: { subject: true } };
        assignement: {
          include: { teacher: { include: { user: { include: { account: { include: { avatar: true } } } } } } };
        };
      };
    }>,
  ): ClassroomExamScheduleResponse {
    return {
      id: examSchedule.exam.id,
      day: examSchedule.day?.toISOString() ?? null,
      startTime: toTime(examSchedule.startTime) ?? null,
      endTime: toTime(examSchedule.endTime) ?? null,
      name: {
        en: examSchedule.exam.name_en,
        fr: examSchedule.exam.name_fr,
        ar: examSchedule.exam.name_ar,
      },
      subject: {
        id: examSchedule.exam.subject.id,
        name: {
          en: examSchedule.exam.subject.name_en,
          fr: examSchedule.exam.subject.name_fr,
          ar: examSchedule.exam.subject.name_ar,
        },
        domain: examSchedule.exam.subject.domain,
      },
      teacher: examSchedule.assignement.teacher
        ? {
            id: examSchedule.assignement.teacher.id,
            firstName: examSchedule.assignement.teacher.user.firstName,
            lastName: examSchedule.assignement.teacher.user.lastName,
            avatar: globalMediaService.toMediaRes(examSchedule.assignement.teacher.user.account.avatar),
            gender: examSchedule.assignement.teacher.user.gender,
          }
        : null,
    };
  }
}
