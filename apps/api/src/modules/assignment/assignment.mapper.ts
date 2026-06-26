import { toTime } from '@/utils/dayjs';
import { GetClassroomTimetableResponse } from '@repo/contracts/schemas/assignment/getClassroomTimetableResponse';
import { TeacherAssignmentRes } from '@repo/contracts/schemas/teacher/teacherAssignmentRes';
import { DayOfWeek } from '@repo/db/prisma/enums';
import { AssignmentGetPayload } from '@repo/db/prisma/models';
import { ClassroomMapper } from '../classroom/classroom.mapper';
import { SubjectMapper } from '../subject/subject.mapper';

export class AssignemntMapper {
  static toClassroomTimeTable(
    assignments: AssignmentGetPayload<{
      select: {
        id: true;
        subject: { select: { id: true; name_en: true; name_fr: true; name_ar: true } };
        teacher: { select: { id: true; user: { select: { firstName: true; lastName: true; gender: true } } } };
        timetable: {
          select: { id: true; day: true; startTime: true; endTime: true; room: true };
          orderBy: { startTime: 'asc' };
        };
      };
    }>[],
  ): GetClassroomTimetableResponse {
    const timeTableResponse: GetClassroomTimetableResponse = {
      [DayOfWeek.MONDAY]: [],
      [DayOfWeek.TUESDAY]: [],
      [DayOfWeek.WEDNESDAY]: [],
      [DayOfWeek.THURSDAY]: [],
      [DayOfWeek.FRIDAY]: [],
      [DayOfWeek.SATURDAY]: [],
      [DayOfWeek.SUNDAY]: [],
    };
    assignments.forEach((assignment) => {
      assignment.timetable.forEach((session) => {
        const sessionDetail: GetClassroomTimetableResponse['FRIDAY'][number] = {
          id: session.id,
          day: session.day,
          startTime: toTime(session.startTime),
          endTime: toTime(session.endTime),
          assignmentId: assignment.id,
          room: session.room,
          subject: {
            id: assignment.subject.id,
            name: {
              en: assignment.subject.name_en,
              fr: assignment.subject.name_fr,
              ar: assignment.subject.name_ar,
            },
          },
          teacher: assignment.teacher
            ? {
                id: assignment.teacher.id,
                firstName: assignment.teacher.user.firstName,
                lastName: assignment.teacher.user.lastName,
                gender: assignment.teacher.user.gender,
              }
            : null,
        };
        timeTableResponse[session.day].push(sessionDetail);
      });
    });

    return timeTableResponse;
  }

  static toTeacherAssignmentsRes(
    assignment: AssignmentGetPayload<{
      include: {
        subject: true;
        classroom: true;
      };
    }>,
  ): TeacherAssignmentRes {
    const classroomResponse = ClassroomMapper.toResponse(assignment.classroom);
    const subjectRes = SubjectMapper.toResponse(assignment.subject);
    return {
      id: assignment.id,
      classroom: classroomResponse,
      subject: subjectRes,
    };
  }
}
