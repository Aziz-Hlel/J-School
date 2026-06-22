import { globalMediaService } from '@/media/media.service';
import { toCalendarDate } from '@/utils/dayjs';
import { HomeworkResponse } from '@repo/contracts/schemas/Homework/response';
import { HomeworkWithStudentsRes } from '@repo/contracts/schemas/Homework/withStudentsRes';
import { HomeworkGetPayload } from '@repo/db/prisma/models';
import { ClassroomMapper } from '../classroom/classroom.mapper';
import { SubjectMapper } from '../subject/subject.mapper';
import { TeacherMapper } from '../teacher/teacher.mapper';

export class HomeworkMapper {
  static toResponse(
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
    const teacherResponse = homework.assignment.teacher ? TeacherMapper.toResponse(homework.assignment.teacher) : null;
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
      teacher: teacherResponse,
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
            classroom: true;
            subject: true;
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
}
