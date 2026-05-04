import prisma from '@repo/db';
import { ClassroomManagementMapper } from './ClassroomManagement.mapper';
import { AssignTeacherRequestInput } from '@repo/contracts/schemas/assignment/assignTeacherRequest';
import type { AssignStudentRequestInput } from '@repo/contracts/schemas/classroom/management/assignStudentRequest';

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
}
