import { RepoKnownErrors } from '@/err/repo/DbError';
import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { PageMapper } from '@/helper/page.mapper';
import { TX } from '@/types/prisma/PrismaTransaction';
import { toTime } from '@/utils/dayjs';
import { FeesQueryParamsTypes } from '@repo/contracts/schemas/Fees/findByStudentIdQueryParam';
import { HomeworkQueryParamsTypes } from '@repo/contracts/schemas/Homework/queryParam';
import { Page } from '@repo/contracts/schemas/page/Page';
import { CreateStudentReq } from '@repo/contracts/schemas/student/createStudentRequest';
import { CreateStudentWithProfileRequest } from '@repo/contracts/schemas/student/createStudentWithProfile';
import type { StudentAttendancesQueryParam } from '@repo/contracts/schemas/student/getAttendances';
import type { StudentAttendanceResponse } from '@repo/contracts/schemas/student/getAttendancesResponse';
import { StudentsQueryParamsTypes } from '@repo/contracts/schemas/student/getStudentsQueryParams';
import type { StudentWeeklyAttendancesQueryParam } from '@repo/contracts/schemas/student/getWeeklyAttendances';
import type { StudentWeeklyAttendanceResponse } from '@repo/contracts/schemas/student/getWeeklyAttendancesResponse';
import { StudentResponse } from '@repo/contracts/schemas/student/studentResponse';
import { UpdateStudentReq } from '@repo/contracts/schemas/student/updateStudentRequest';
import { UpdateStudentWithProfileRequest } from '@repo/contracts/schemas/student/updateStudentWithProfileRequest';
import { TeacherCommentsQueryParamsTypes } from '@repo/contracts/schemas/TeacherComments/queryParams';
import prisma from '@repo/db';
import { Prisma } from '@repo/db/prisma/client';
import { DayOfWeek, StudentStatus } from '@repo/db/prisma/enums';
import { ExtraCurricularMapper } from '../ExtraCurricular/ExtraCurricular.mapper';
import { FeesMapper } from '../Fees/fees.mapper';
import { HomeworkMapper } from '../Homework/homework.mapper';
import { TeacherCommentsMapper } from '../TeacherComments/teacherComments.mapper';
import { StudentMapper } from './student.mapper';
import { StudentRepo } from './student.repo';

export class StudentService {
  constructor(private readonly studentRepo: StudentRepo) {}

  create = async (params: { input: CreateStudentReq; schoolId: string }, tx?: TX) => {
    const { input, schoolId } = params;
    try {
      const createdStudent = await this.studentRepo.create({ input, schoolId }, tx);
      const studentResponse = StudentMapper.toResponse(createdStudent);
      return studentResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.ConflictError) {
        throw new ConflictError({ message: 'Student already exists', cause: error });
      }
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({ message: 'Failed to create student', cause: error });
      }
      throw error;
    }
  };

  update = async (
    params: { input: UpdateStudentReq & { status: StudentStatus }; studentId: string; schoolId: string },
    tx?: TX,
  ) => {
    const { input, schoolId, studentId } = params;
    try {
      const updatedStudent = await this.studentRepo.update({ input, schoolId, studentId }, tx);
      const studentResponse = StudentMapper.toResponse(updatedStudent);
      return studentResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.ConflictError) {
        throw new ConflictError({ message: 'Student already exists', cause: error });
      }
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({ message: 'Student not found', cause: error });
      }
      throw error;
    }
  };

  createWithProfile = async (params: { input: CreateStudentWithProfileRequest; schoolId: string }, tx?: TX) => {
    const { input, schoolId } = params;
    try {
      const createdStudent = await this.studentRepo.createWithProfile({ input, schoolId }, tx);
      const studentResponse = StudentMapper.toResponse(createdStudent);
      return studentResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.ConflictError) {
        throw new ConflictError({ message: 'Student already exists', cause: error });
      }
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({ message: 'Failed to create student', cause: error });
      }
      throw error;
    }
  };

  updateWithProfile = async (
    params: { input: UpdateStudentWithProfileRequest; schoolId: string; studentId: string },
    tx?: TX,
  ) => {
    const { input, schoolId, studentId } = params;
    try {
      const updatedStudent = await this.studentRepo.updateWithProfile({ input, schoolId, studentId }, tx);
      const studentResponse = StudentMapper.toResponse(updatedStudent);
      return studentResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.ConflictError) {
        throw new ConflictError({ message: 'Student already exists', cause: error });
      }
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({ message: 'Student not found', cause: error });
      }
      throw error;
    }
  };

  findById = async (params: { schoolId: string; studentId: string }, tx?: TX) => {
    const { schoolId, studentId } = params;
    try {
      const student = await this.studentRepo.findById({ schoolId, studentId }, tx);
      if (!student) {
        throw new NotFoundError({ message: 'Student not found' });
      }
      const studentResponse = StudentMapper.toResponse(student);
      return studentResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({ message: 'Student not found', cause: error });
      }
      throw error;
    }
  };

  getExtraCurricular = async (params: { schoolId: string; studentId: string }) => {
    const { schoolId, studentId } = params;

    // * prob need to add a orderBy the last post
    const queryResult = await prisma.studentExtraCurricular.findMany({
      where: {
        studentId,
        schoolId,
      },
      include: {
        extraCurricular: { include: { title: true, session: true, teacher: { include: { user: true } } } },
      },
    });

    const result = queryResult.map((item) => ExtraCurricularMapper.toResponse(item.extraCurricular));
    return result;
  };

  findAll = async (params: {
    schoolId: string;
    query: StudentsQueryParamsTypes['Query'];
  }): Promise<Page<StudentResponse>> => {
    const { query, schoolId } = params;

    const skip = (query.page - 1) * query.size;
    const take = query.size;

    const where: Prisma.StudentWhereInput = {
      schoolId,
    };

    if (query.status.length > 0) {
      where.status = {
        in: query.status,
      };
    }

    if (query.gender.length > 0) {
      where.gender = {
        in: query.gender,
      };
    }
    console.log('query.status = ', query.status);
    console.log('query.gender = ', query.gender);

    if (query.search && query.search.trim().length > 0) {
      const searchValue = query.search.trim();
      where.OR = [
        { firstName_en: { contains: searchValue, mode: 'insensitive' } },
        { lastName_en: { contains: searchValue, mode: 'insensitive' } },
        { firstName_ar: { contains: searchValue, mode: 'insensitive' } },
        { lastName_ar: { contains: searchValue, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.StudentOrderByWithRelationInput = {};

    switch (query.sortBy) {
      case 'english_name':
        orderBy.firstName_en = query.order;
        break;
      case 'arabic_name':
        orderBy.firstName_en = query.order;
        break;
      case 'grade':
        orderBy.classroom = { grade: query.order };
        break;
      case 'status':
        orderBy.status = query.order;
        break;
      default:
        orderBy[query.sortBy] = query.order;
        break;
    }

    const students = prisma.student.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        avatar: true,
        classroom: true,
      },
    });

    const studentsCount = prisma.student.count({ where });

    const [content, totalElements] = await Promise.all([students, studentsCount]);

    const studentResponses = content.map(StudentMapper.toResponseWithClassroom);
    const pageResponse = PageMapper.toPage({
      pagination: query,
      totalElements,
      data: studentResponses,
    });
    return pageResponse;
  };

  findAttendances = async (params: {
    schoolId: string;
    studentId: string;
    query: StudentAttendancesQueryParam;
  }): Promise<StudentAttendanceResponse[]> => {
    const { schoolId, studentId, query } = params;

    const queryResult = await this.studentRepo.findStudentAttendance({ schoolId, studentId, query });

    const response: StudentAttendanceResponse[] = queryResult.map((item) => {
      return {
        id: item.id,
        status: item.status,
        note: item.note,
        subject: {
          name: {
            en: item.timetable.assignment.subject.name_en,
            ar: item.timetable.assignment.subject.name_ar,
            fr: item.timetable.assignment.subject.name_fr,
          },
          day: item.timetable.day,
          startTime: toTime(item.timetable.startTime),
          endTime: toTime(item.timetable.endTime),
        },
      };
    });

    return response;
  };

  findWeeklyAttendances = async (params: {
    schoolId: string;
    studentId: string;
    query: StudentWeeklyAttendancesQueryParam;
  }): Promise<StudentWeeklyAttendanceResponse> => {
    const { schoolId, studentId, query } = params;

    const queryResult = await this.studentRepo.findStudentAttendance({ schoolId, studentId, query });

    const timeTableResponse: StudentWeeklyAttendanceResponse = {
      [DayOfWeek.MONDAY]: [],
      [DayOfWeek.TUESDAY]: [],
      [DayOfWeek.WEDNESDAY]: [],
      [DayOfWeek.THURSDAY]: [],
      [DayOfWeek.FRIDAY]: [],
      [DayOfWeek.SATURDAY]: [],
      [DayOfWeek.SUNDAY]: [],
    };

    queryResult.forEach((item) =>
      timeTableResponse[item.timetable.day].push({
        id: item.timetable.id,
        day: item.timetable.day,
        startTime: toTime(item.timetable.startTime),
        endTime: toTime(item.timetable.endTime),
        subject: {
          id: item.timetable.assignment.subject.id,
          name: {
            en: item.timetable.assignment.subject.name_en,
            ar: item.timetable.assignment.subject.name_ar,
            fr: item.timetable.assignment.subject.name_fr,
          },
        },
        attendance: {
          id: item.id,
          status: item.status,
          note: item.note,
        },
      }),
    );

    return timeTableResponse;
  };

  findFees = async (params: { schoolId: string; query: FeesQueryParamsTypes['Query']; studentId: string }) => {
    const { query, schoolId, studentId } = params;

    const skip = (query.page - 1) * query.size;
    const take = query.size;

    const where: Prisma.FeesWhereInput = {
      schoolId,
      studentId,
    };

    if (query.status.length !== 0) {
      where.feeItems = {
        every: {
          status: {
            in: query.status,
          },
        },
      };
    }

    const orderBy: Prisma.FeesOrderByWithRelationInput = {};

    if (query.sortBy) {
      orderBy[query.sortBy] = query.order;
    }

    const queryResponse = prisma.fees.findMany({
      skip,
      take,
      where: { ...where, schoolId },
      orderBy,
      include: {
        feeItems: {
          include: { payment: true },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    const count = prisma.fees.count({ where: { ...where, schoolId } });

    const [content, totalElements] = await Promise.all([queryResponse, count]);

    const dataResponse = content.map(FeesMapper.toResponse);

    const pageResponse = PageMapper.toPage({
      data: dataResponse,
      pagination: query,
      totalElements: totalElements,
    });

    return pageResponse;
  };

  findAllComments = async (params: {
    query: TeacherCommentsQueryParamsTypes['Query'];
    schoolId: string;
    studentId?: string;
  }) => {
    const { query, schoolId, studentId } = params;

    const skip = (query.page - 1) * query.size;
    const take = query.size;

    const where: Prisma.TeacherCommentWhereInput = {
      schoolId,
      studentId,
    };

    const orderBy: Prisma.TeacherCommentOrderByWithRelationInput = {};

    if (query.sortBy) {
      orderBy[query.sortBy] = query.order;
    }

    const queryResponse = prisma.teacherComment.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        student: true,
        teacher: {
          include: {
            user: { select: { account: { select: { avatar: true } }, firstName: true, lastName: true, id: true } },
          },
        },
      },
    });

    const count = prisma.teacherComment.count({ where });

    const [content, totalElements] = await Promise.all([queryResponse, count]);

    const dataResponse = content.map(TeacherCommentsMapper.toResponse);

    const pageResponse = PageMapper.toPage({
      data: dataResponse,
      pagination: query,
      totalElements: totalElements,
    });

    return pageResponse;
  };

  findAllHomework = async (params: {
    schoolId: string;
    studentId: string;
    query: HomeworkQueryParamsTypes['Query'];
  }) => {
    const { schoolId, studentId, query } = params;

    const skip = (query.page - 1) * query.size;
    const take = query.size;

    const where: Prisma.HomeworkWhereInput = {
      schoolId,
      studentHomeworks: {
        some: {
          studentId,
        },
      },
    };

    const orderBy: Prisma.HomeworkOrderByWithRelationInput = {
      due: 'desc',
    };

    const queryResponse = prisma.homework.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        files: true,
        assignment: {
          include: {
            classroom: true,
            subject: true,
            teacher: { include: { user: { include: { account: { include: { avatar: true } } } } } },
          },
        },
      },
    });

    const count = prisma.homework.count({
      where,
    });

    const [content, totalElements] = await Promise.all([queryResponse, count]);

    const dataResponse = content.map((homework) => HomeworkMapper.toResponse(homework));

    const pageResponse = PageMapper.toPage({
      data: dataResponse,
      pagination: query,
      totalElements: totalElements,
    });

    return pageResponse;
  };
}
