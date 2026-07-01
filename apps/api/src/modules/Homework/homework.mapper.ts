import { globalMediaService } from '@/media/media.service';
import { toCalendarDate } from '@/utils/dayjs';
import { HomeworkResponse } from '@repo/contracts/schemas/Homework/response';
import type { HomeworkWithTeacherAndStudents } from '@repo/contracts/schemas/Homework/responseWithTeacherAndStudents';
import { HomeworkWithStudentsRes } from '@repo/contracts/schemas/Homework/withStudentsRes';
import { HomeworkGetPayload } from '@repo/db/prisma/models';
import { ClassroomMapper } from '../classroom/classroom.mapper';
import { SubjectMapper } from '../subject/subject.mapper';

export class HomeworkMapper {
  static toResponseWithTeacher(
    homework: HomeworkGetPayload<{
      include: {
        files: true;
        assignment: {
          include: {
            classroom: true;
            subject: true;
            teacher: { include: { user: { include: { account: { include: { avatar: true } } } } } };
          };
        };
      };
    }>,
  ): HomeworkResponse {
    const subjectResponse = SubjectMapper.toResponse(homework.assignment.subject);
    const classroomResponse = ClassroomMapper.toResponse(homework.assignment.classroom);
    const teacherAvatar = globalMediaService.toMediaRes(homework.assignment.teacher?.user?.account?.avatar ?? null);
    const filesResponse = homework.files.map((f) => globalMediaService.toMediaResWithOrder(f));
    return {
      id: homework.id,
      title: homework.title,
      content: homework.content,
      type: homework.type,
      files: filesResponse,
      due: toCalendarDate(homework.due),
      subject: subjectResponse,
      classroom: classroomResponse,
      teacher: homework.assignment.teacher
        ? {
            id: homework.assignment.teacher.id,
            firstName: homework.assignment.teacher.user.firstName,
            lastName: homework.assignment.teacher.user.lastName,
            gender: homework.assignment.teacher.user.gender,
            avatar: teacherAvatar,
          }
        : null,
    };
  }

  static toResWithStudents(
    homework: HomeworkGetPayload<{
      include: {
        files: true;
        studentHomeworks: {
          include: {
            student: true;
          };
        };
        assignment: {
          include: {
            subject: true;
            classroom: true;
          };
        };
      };
    }>,
  ): HomeworkWithStudentsRes {
    const subjectResponse = SubjectMapper.toResponse(homework.assignment.subject);
    const classroomResponse = ClassroomMapper.toResponse(homework.assignment.classroom);
    const filesResponse = homework.files.map((f) => globalMediaService.toMediaResWithOrder(f));

    return {
      id: homework.id,
      title: homework.title,
      content: homework.content,
      assignementId: homework.assignmentId,
      type: homework.type,
      files: filesResponse,
      due: toCalendarDate(homework.due),
      subject: subjectResponse,
      classroom: classroomResponse,
      students: homework.studentHomeworks.map((sh) => ({
        id: sh.studentId,
        firstName: {
          en: sh.student.firstName_en,
          ar: sh.student.firstName_ar,
        },
        lastName: {
          en: sh.student.lastName_en,
          ar: sh.student.lastName_ar,
        },
        gender: sh.student.gender,
      })),
    };
  }

  static toResWithTeacherAndStudents(
    homework: HomeworkGetPayload<{
      include: {
        files: true;
        studentHomeworks: {
          include: {
            student: true;
          };
        };
        assignment: {
          include: {
            teacher: { include: { user: { include: { account: { include: { avatar: true } } } } } };
            subject: true;
            classroom: true;
          };
        };
      };
    }>,
  ): HomeworkWithTeacherAndStudents {
    const subjectResponse = SubjectMapper.toResponse(homework.assignment.subject);
    const filesResponse = homework.files.map((f) => globalMediaService.toMediaResWithOrder(f));
    const teacherAvatar = globalMediaService.toMediaRes(homework.assignment.teacher?.user?.account?.avatar ?? null);
    const classroomResponse = ClassroomMapper.toResponse(homework.assignment.classroom);

    return {
      id: homework.id,
      title: homework.title,
      content: homework.content,
      assignementId: homework.assignmentId,
      type: homework.type,
      files: filesResponse,
      due: toCalendarDate(homework.due),
      subject: subjectResponse,
      classroom: classroomResponse,
      teacher: homework.assignment.teacher
        ? {
            id: homework.assignment.teacher.id,
            firstName: homework.assignment.teacher.user.firstName,
            lastName: homework.assignment.teacher.user.lastName,
            gender: homework.assignment.teacher.user.gender,
            avatar: teacherAvatar,
          }
        : null,
      students: homework.studentHomeworks.map((sh) => ({
        id: sh.studentId,
        firstName: {
          en: sh.student.firstName_en,
          ar: sh.student.firstName_ar,
        },
        lastName: {
          en: sh.student.lastName_en,
          ar: sh.student.lastName_ar,
        },
        gender: sh.student.gender,
      })),
    };
  }
}
