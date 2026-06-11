import { BadRequestError } from '@/err/service/customErrors';
import { globalMediaService } from '@/media/media.service';
import { StudentMapper } from '@/modules/student/student.mapper';
import { AssignTeacherRequestInput } from '@repo/contracts/schemas/assignment/assignTeacherRequest';
import type { AssignStudentRequestInput } from '@repo/contracts/schemas/classroom/management/assignStudentRequest';
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

  assignStudent = async (params: { schoolId: string; classroomId: string; input: AssignStudentRequestInput }) => {
    const { schoolId, classroomId, input } = params;

    return await prisma.student.update({
      where: {
        id: input.studentId,
        schoolId,
      },
      data: {
        classroomId,
      },
    });
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
            status: true,
            id: true,
          },
        },
        avatar: true,
      },
    });

    const response: ClassroomAttendancesResponse[] = students.map((student) => {
      return {
        id: student.id,
        firstName_en: student.firstName_en,
        lastName_en: student.lastName_en,
        firstName_ar: student.firstName_ar,
        lastName_ar: student.lastName_ar,
        gender: student.gender,
        avatar: globalMediaService.toMediaResponse(student.avatar),
        attendance: student.attendances[0] ?? null,
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
}
