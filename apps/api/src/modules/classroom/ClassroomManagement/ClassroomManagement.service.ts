import { BadRequestError } from '@/err/service/customErrors';
import { globalMediaService } from '@/media/media.service';
import { StudentMapper } from '@/modules/student/student.mapper';
import { AssignTeacherRequestInput } from '@repo/contracts/schemas/assignment/assignTeacherRequest';
import type { ClassroomExamsRes } from '@repo/contracts/schemas/classroom/management/ClassroomExamsRes';
import type { GetClassroomAttendancesQuery } from '@repo/contracts/schemas/classroom/management/getClassroomAttendancesQuery';
import type { ClassroomAttendancesResponse } from '@repo/contracts/schemas/classroom/management/getClassroomAttendancesResponse';
import prisma from '@repo/db';
import { ClassroomManagementMapper } from './ClassroomManagement.mapper';

export const getSubjectsWithTeachersSelect = {
  id: true,
  subject: true,
  teacher: {
    select: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          gender: true,
          account: {
            select: {
              avatar: true,
            },
          },
        },
      },
    },
  },
};

export class ClassroomManagementService {
  getSubjectsWithTeachers = async (params: { schoolId: string; classroomId: string }) => {
    const subjects = await prisma.assignment.findMany({
      where: {
        classroomId: params.classroomId,
        schoolId: params.schoolId,
      },
      select: getSubjectsWithTeachersSelect,
    });

    const response = ClassroomManagementMapper.toClassroomSubjectsWithTeachersResponse(subjects);
    return response;
  };

  getExams = async (params: { schoolId: string; classroomId: string }) => {
    const examsSchedule = await prisma.examSchedule.findMany({
      where: {
        schoolId: params.schoolId,
        assignement: {
          classroomId: params.classroomId,
        },
      },
      include: {
        exam: {
          include: {
            subject: true,
          },
        },
        assignement: {
          include: {
            teacher: {
              include: {
                user: {
                  include: {
                    account: {
                      include: {
                        avatar: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [{ day: { sort: 'asc', nulls: 'last' } }, { startTime: { sort: 'asc', nulls: 'last' } }],
    });

    const response = examsSchedule.map(ClassroomManagementMapper.toExamScheduleResponse);
    return response;
  };

  assignTeacher = async (params: { schoolId: string; classroomId: string; input: AssignTeacherRequestInput }) => {
    const { schoolId, classroomId, input } = params;
    const assignment = await prisma.assignment.update({
      where: {
        schoolId_classroomId_subjectId: {
          schoolId,
          classroomId,
          subjectId: input.subjectId,
        },
      },
      data: {
        teacherId: input.teacherId,
      },
    });
    return assignment;
  };

  getAttendances = async (params: {
    schoolId: string;
    classroomId: string;
    query: GetClassroomAttendancesQuery;
  }): Promise<ClassroomAttendancesResponse[]> => {
    const { schoolId, classroomId, query } = params;
    if (query.timetableId === undefined) throw new BadRequestError('Subject ID is required');

    const students = await prisma.student.findMany({
      where: {
        classroomId,
        schoolId,
      },
      select: {
        id: true,
        firstName_en: true,
        lastName_en: true,
        firstName_ar: true,
        lastName_ar: true,
        gender: true,
        attendances: {
          where: {
            timetableId: query.timetableId,
            week: query.week,
          },
          select: {
            id: true,
            status: true,
            note: true,
          },
        },
        avatar: true,
      },
    });

    const studentIds = students.map((s) => s.id);

    const isLastAttendance = students.find((student) => student.attendances.length !== 0);

    const lastAttendances = !isLastAttendance
      ? await prisma.attendance.findMany({
          where: {
            studentId: { in: studentIds },
          },
          orderBy: { createdAt: 'desc' },
          distinct: ['studentId'],
          select: {
            id: true,
            status: true,
            note: true,
            studentId: true,
          },
        })
      : [];

    const lastAttendanceMap = new Map(lastAttendances.map((a) => [a.studentId, a]));

    const response: ClassroomAttendancesResponse[] = students.map((student) => {
      const lastAtt = lastAttendanceMap.get(student.id);
      return {
        id: student.id,
        firstName: {
          en: student.firstName_en,
          ar: student.firstName_ar,
        },
        lastName: {
          en: student.lastName_en,
          ar: student.lastName_ar,
        },
        gender: student.gender,
        avatar: globalMediaService.toMediaRes(student.avatar),
        attendance: student.attendances[0]
          ? {
              id: student.attendances[0]?.id,
              status: student.attendances[0]?.status,
              note: student.attendances[0]?.note,
            }
          : null,
        lastAttendance: lastAtt ? { id: lastAtt.id, status: lastAtt.status, note: lastAtt.note } : null,
      };
    });

    return response;
  };

  getStudents = async (params: { schoolId: string; classroomId: string }) => {
    const students = await prisma.student.findMany({
      where: {
        schoolId: params.schoolId,
        classroomId: params.classroomId,
      },
      include: { avatar: true },
    });
    const studentsResponse = students.map(StudentMapper.toResponse);

    return studentsResponse;
  };

  selectClassroomExams = async (params: { schoolId: string; classroomId: string }) => {
    const classroomExamQuery = await prisma.assignment.findMany({
      where: {
        schoolId: params.schoolId,
        classroomId: params.classroomId,
      },
      include: {
        subject: {
          include: {
            exams: true,
          },
        },
      },
    });

    const respone: ClassroomExamsRes[] = classroomExamQuery.flatMap((assignment) =>
      assignment.subject.exams.map((exam) => ({
        id: exam.id,
        assignmentId: assignment.id,
        name: {
          en: exam.name_en,
          ar: exam.name_ar,
        },
        subject: {
          id: assignment.subject.id,
          name: {
            en: assignment.subject.name_en,
            ar: assignment.subject.name_ar,
          },
        },
      })),
    );

    return respone;
  };
}
