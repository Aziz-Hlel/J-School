import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { PageMapper } from '@/helper/page.mapper';
import { TX } from '@/types/prisma/PrismaTransaction';
import { toCalendarDate, toTime } from '@/utils/dayjs';
import { Page } from '@repo/contracts/schemas/page/Page';
import { MyCommentsQueryParamsTypes } from '@repo/contracts/schemas/teacher/commentsQueryParams';
import type { TeacherTimetableRes } from '@repo/contracts/schemas/teacher/getTimetableResponse';
import { TeacherHomeworkQueryParamsTypes } from '@repo/contracts/schemas/teacher/homeworQueryParams';
import { TeacherFullTimetableRes } from '@repo/contracts/schemas/teacher/teacherFullTimeTableRes';
import type { TeacherQueryParamsTypes } from '@repo/contracts/schemas/teacher/teacherQueryParams';
import { TeacherResponse } from '@repo/contracts/schemas/teacher/teacherResponse';
import { UpdateTeacherRequest } from '@repo/contracts/schemas/teacher/updateTeacherRequest';
import prisma from '@repo/db';
import { DayOfWeek, Prisma } from '@repo/db/prisma/client';
import { ClassroomMapper } from '../classroom/classroom.mapper';
import { ExamScheduleMapper } from '../ExamSchedule/ExamSchedule.mapper';
import { HomeworkMapper } from '../Homework/homework.mapper';
import { TeacherCommentsMapper } from '../TeacherComments/teacherComments.mapper';
import { UserService } from '../User/user.service';
import { TeacherMapper } from './teacher.mapper';
import { TeacherRepo } from './teacher.repo';

export class TeacherService {
  constructor(
    private readonly teacherRepo: TeacherRepo,
    private readonly userService: UserService,
  ) {}

  create = async ({ userId }: { userId: string }, tx?: TX) => {
    const existingTeacher = await this.teacherRepo.findByUserId({ userId });
    if (existingTeacher) {
      throw new ConflictError({
        message: 'Teacher already exists',
        internalLog: `Teacher with userId ${userId} already exists`,
      });
    }
    const createdTeacher = await this.teacherRepo.create({ userId }, tx);

    return createdTeacher;
  };

  findByUserId = async ({ userId }: { userId: string }) => {
    const teacher = await this.teacherRepo.findByUserId(
      { userId },
      { include: { user: { include: { account: { include: { avatar: true } } } } } },
    );
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    const teacherResponse = TeacherMapper.toResponse(teacher);
    return teacherResponse;
  };

  getById = async (teacherId: string, schoolId: string) => {
    const teacher = await this.teacherRepo.findById(
      { id: teacherId },
      { include: { user: { include: { account: { include: { avatar: true } } } } } },
    );
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }
    if (teacher.user.schoolId !== schoolId) {
      throw new NotFoundError('Teacher not found');
    }

    const teacherResponse = TeacherMapper.toResponse(teacher);
    return teacherResponse;
  };

  update = async ({
    input,
    teacherId,
    schoolId,
  }: {
    input: UpdateTeacherRequest;
    teacherId: string;
    schoolId: string;
  }) => {
    const existingTeacher = await this.teacherRepo.findById(
      { id: teacherId },
      { include: { user: { select: { id: true, schoolId: true } } } },
    );

    if (!existingTeacher) {
      throw new NotFoundError('Teacher not found');
    }
    if (existingTeacher.user.schoolId !== schoolId) {
      throw new NotFoundError({
        message: 'Teacher not found',
        internalLog: `Teacher with id ${teacherId} exists but not in school ${schoolId}`,
      });
    }

    const updatedUser = await this.userService.updateSimpleUser({
      input,
      userId: existingTeacher.user.id,
      schoolId,
    }); // ? All Teacher fields to be updated are in user table
    return {
      id: existingTeacher.id,
      user: updatedUser,
    };
  };

  findAll = async (params: {
    schoolId: string;
    query: TeacherQueryParamsTypes['Query'];
  }): Promise<Page<TeacherResponse>> => {
    const { query, schoolId } = params;

    const skip = (query.page - 1) * query.size;
    const take = query.size;

    const where: Prisma.TeacherWhereInput = {};

    if (query.search && query.search.trim().length > 0) {
      const searchValue = query.search.trim().toLowerCase();
      where.user = {
        is: {
          OR: [
            { firstName: { contains: searchValue, mode: 'insensitive' } },
            { lastName: { contains: searchValue, mode: 'insensitive' } },
          ],
        },
      };
    }

    const orderBy: Prisma.TeacherOrderByWithRelationInput = {};

    if (query.sortBy === 'firstName' || query.sortBy === 'lastName' || query.sortBy === 'gender') {
      orderBy.user = {
        [query.sortBy]: query.order,
      };
    }

    if (query.sortBy === 'createdAt') {
      orderBy[query.sortBy] = query.order;
    }

    const teachers = await this.teacherRepo.findAll(
      {
        schoolId,
        skip,
        take,
        where,
        orderBy,
      },
      { user: { include: { account: { include: { avatar: true } } } } },
    );

    const teacherResponses = teachers.content.map(TeacherMapper.toResponse);

    const pageResponse = PageMapper.toPage({
      pagination: query,
      totalElements: teachers.totalElements,
      data: teacherResponses,
    });

    return pageResponse;
  };

  getTimetable = async (params: {
    schoolId: string;
    teacherId: string;
    query: { day?: DayOfWeek };
  }): Promise<TeacherTimetableRes[]> => {
    const { schoolId, teacherId } = params;

    //* maybe add extra-curricular to the timetable

    const timetable = await prisma.timetable.findMany({
      where: {
        assignment: {
          schoolId,
          teacherId,
        },
        day: params.query.day,
      },
      select: {
        id: true,
        day: true,
        startTime: true,
        endTime: true,
        room: true,
        assignment: {
          select: {
            subject: {
              select: {
                name_en: true,
                name_fr: true,
                name_ar: true,
              },
            },
            classroom: {
              select: {
                id: true,
                name: true,
                grade: true,
              },
            },
          },
        },
      },
    });

    const response: TeacherTimetableRes[] = timetable.map((entry) => ({
      id: entry.id,
      day: entry.day,
      startTime: toTime(entry.startTime),
      endTime: toTime(entry.endTime),
      room: entry.room,
      subject: {
        name: {
          en: entry.assignment.subject.name_en,
          fr: entry.assignment.subject.name_fr,
          ar: entry.assignment.subject.name_ar,
        },
      },
      classroom: {
        id: entry.assignment.classroom.id,
        name: entry.assignment.classroom.name,
        grade: entry.assignment.classroom.grade,
      },
    }));

    return response;
  };

  getFullTimetable = async (params: { schoolId: string; teacherId: string }) => {
    const { schoolId, teacherId } = params;

    const queryResponse = await prisma.timetable.findMany({
      where: {
        assignment: {
          schoolId,
          teacherId,
        },
      },
      select: {
        id: true,
        day: true,
        startTime: true,
        endTime: true,
        room: true,
        assignment: {
          select: {
            subject: {
              select: {
                id: true,
                name_en: true,
                name_fr: true,
                name_ar: true,
              },
            },
            classroom: {
              select: {
                id: true,
                name: true,
                grade: true,
              },
            },
          },
        },
      },
    });

    const timetableResponse: TeacherFullTimetableRes = {
      [DayOfWeek.MONDAY]: [],
      [DayOfWeek.TUESDAY]: [],
      [DayOfWeek.WEDNESDAY]: [],
      [DayOfWeek.THURSDAY]: [],
      [DayOfWeek.FRIDAY]: [],
      [DayOfWeek.SATURDAY]: [],
      [DayOfWeek.SUNDAY]: [],
    };
    queryResponse.forEach((entry) => {
      timetableResponse[entry.day].push({
        id: entry.id,
        day: entry.day,
        startTime: toTime(entry.startTime),
        endTime: toTime(entry.endTime),
        room: entry.room,
        subject: {
          id: entry.assignment.subject.id,
          name: {
            en: entry.assignment.subject.name_en,
            fr: entry.assignment.subject.name_fr,
            ar: entry.assignment.subject.name_ar,
          },
        },
        classroom: {
          id: entry.assignment.classroom.id,
          name: entry.assignment.classroom.name,
          grade: entry.assignment.classroom.grade,
        },
      });
    });

    return timetableResponse;
  };

  getExtracurricular = async (params: { schoolId: string; teacherId: string; query: { day?: DayOfWeek } }) => {
    const { schoolId, teacherId } = params;

    const extracurriculars = await prisma.extraCurricular.findMany({
      where: {
        teacherId,
        schoolId,
        session: {
          day: params.query.day,
        },
      },
      include: {
        title: true,
        session: true,
      },
      orderBy: [{ session: { day: 'asc' } }, { session: { startTime: 'asc' } }],
    });

    const response = extracurriculars.map((entry) => ({
      id: entry.id,
      title: {
        en: entry.title?.en ?? '', // *
        fr: entry.title?.fr ?? '',
        ar: entry.title?.ar ?? '',
      },
      session: {
        day: entry.session?.day ?? null,
        startTime: entry.session?.startTime ? toTime(entry.session.startTime) : null,
        endTime: entry.session?.endTime ? toTime(entry.session.endTime) : null,
        date: entry.session?.date ? toCalendarDate(entry.session.date) : null,
        type: entry.session?.type ?? null,
      },
      createdAt: entry.createdAt.toISOString(),
    }));

    return response;
  };

  getClassrooms = async (params: { schoolId: string; teacherId: string }) => {
    const { schoolId, teacherId } = params;
    const result = await prisma.assignment.findMany({
      where: {
        teacherId,
        schoolId,
      },
      distinct: ['classroomId'],
      select: {
        classroom: true,
      },
    });

    const classrooms = result.map((entry) => entry.classroom);
    const response = classrooms.map(ClassroomMapper.toResponse);
    return response;
  };

  getExamSchedule = async (params: { schoolId: string; teacherId: string }) => {
    const { schoolId, teacherId } = params;

    const examSchedules = await prisma.examSchedule.findMany({
      where: {
        schoolId,
        assignement: {
          teacherId,
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
            classroom: true,
          },
        },
      },
      orderBy: [
        {
          day: {
            sort: 'asc',
            nulls: 'last',
          },
        },
        {
          startTime: 'asc',
        },
      ],
    });

    const response = examSchedules.map(ExamScheduleMapper.teacherExamScheduleResponse);

    return response;
  };

  getHomeworks = async (params: {
    schoolId: string;
    teacherId: string;
    query: TeacherHomeworkQueryParamsTypes['Query'];
  }) => {
    const { schoolId, teacherId, query } = params;

    const skip = (query.page - 1) * query.size;
    const take = query.size;

    const where: Prisma.HomeworkWhereInput = {
      schoolId,
      assignment: {
        teacherId,
      },
    };

    if (query.classroomId || query.studentId) {
      where.studentHomeworks = {
        some: {
          ...(query.classroomId && {
            student: {
              classroomId: query.classroomId,
            },
          }),
          ...(query.studentId && {
            studentId: query.studentId,
          }),
        },
      };
    }

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
            subject: true,
          },
        },
        studentHomeworks: {
          include: {
            student: true,
          },
        },
      },
    });

    const count = prisma.homework.count({
      where,
    });

    const [content, totalElements] = await Promise.all([queryResponse, count]);

    const dataResponse = content.map((homework) => HomeworkMapper.toResWithStudents(homework));

    const pageResponse = PageMapper.toPage({
      data: dataResponse,
      pagination: query,
      totalElements: totalElements,
    });

    return pageResponse;
  };

  getComments = async (params: { schoolId: string; teacherId: string; query: MyCommentsQueryParamsTypes['Query'] }) => {
    const { schoolId, teacherId, query } = params;

    const skip = (query.page - 1) * query.size;
    const take = query.size;

    const where: Prisma.TeacherCommentWhereInput = {
      schoolId,
      teacherId,
    };

    if (query.studentId) where.studentId = query.studentId;

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
        student: {
          include: {
            avatar: true,
          },
        },
        teacher: {
          include: {
            user: {
              select: {
                account: { select: { avatar: true } },
                firstName: true,
                lastName: true,
                id: true,
              },
            },
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
}
