import { globalMediaService } from '@/media/media.service';
import { toCalendarDate, toTime } from '@/utils/dayjs';
import { ExamScheduleResponse } from '@repo/contracts/schemas/examSchedule/examScheduleResponse';
import { ExamScheduleWithClassroomRes } from '@repo/contracts/schemas/examSchedule/examScheduleWithClassroomResponse';
import { ExamScheduleGetPayload } from '@repo/db/prisma/models';
import { ClassroomMapper } from '../classroom/classroom.mapper';

export class ExamScheduleMapper {
  static examScheduleResponse(
    examSchedule: ExamScheduleGetPayload<{
      include: {
        exam: true;
        assignement: {
          include: {
            teacher: {
              include: {
                user: {
                  include: {
                    account: {
                      include: {
                        avatar: true;
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    }>,
  ): ExamScheduleResponse {
    return {
      id: examSchedule.id,
      day: toCalendarDate(examSchedule.day),
      startTime: toTime(examSchedule.startTime),
      endTime: toTime(examSchedule.endTime),
      exam: {
        id: examSchedule.exam.id,
        name: {
          en: examSchedule.exam.name_en,
          fr: examSchedule.exam.name_fr,
          ar: examSchedule.exam.name_ar,
        },
        durationInMin: examSchedule.exam.durationInMin,
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

  static teacherExamScheduleResponse(
    examSchedule: ExamScheduleGetPayload<{
      include: { exam: { include: { subject: true } }; assignement: { include: { classroom: true } } };
    }>,
  ): ExamScheduleWithClassroomRes {
    return {
      id: examSchedule.id,
      day: toCalendarDate(examSchedule.day),
      startTime: toTime(examSchedule.startTime),
      endTime: toTime(examSchedule.endTime),
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
      classroom: ClassroomMapper.toResponse(examSchedule.assignement.classroom),
    };
  }
}
