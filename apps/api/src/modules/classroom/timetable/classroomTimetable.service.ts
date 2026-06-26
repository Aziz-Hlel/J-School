import { NotFoundError } from '@/err/service/customErrors';
import { AssignemntMapper } from '@/modules/assignment/assignment.mapper';
import { TimetableMapper } from '@/modules/timetable/timetable.mapper';
import { TX } from '@/types/prisma/PrismaTransaction';
import { CreateClassroomTimetableReq } from '@repo/contracts/schemas/classroom/timeTable/createTimetableRequest2';
import { updateTimetableRequest } from '@repo/contracts/schemas/timeTable/updateTimetableRequest';
import prisma from '@repo/db';
import { TimetableRepo } from './timetable.repo';

export class ClassroomTimetableService {
  constructor(private readonly repo: TimetableRepo) {}

  getTimeTable = async (params: { schoolId: string; classroomId: string }, tx?: TX) => {
    const { schoolId, classroomId } = params;
    const client = tx ?? prisma;
    const classroom = await client.assignment.findMany({
      where: {
        schoolId,
        classroomId,
      },
      select: {
        id: true,
        subject: { select: { id: true, name_en: true, name_fr: true, name_ar: true } },
        teacher: { select: { id: true, user: { select: { firstName: true, lastName: true, gender: true } } } },
        timetable: {
          select: { id: true, day: true, startTime: true, endTime: true, room: true },
          orderBy: { startTime: 'asc' },
        },
      },
    });

    const timeTableResponse = AssignemntMapper.toClassroomTimeTable(classroom);
    return timeTableResponse;
  };

  private getAssignmentId = async (params: { schoolId: string; classroomId: string; subjectId: string }) => {
    const assignment = await prisma.assignment.findUnique({
      where: {
        schoolId_classroomId_subjectId: params,
      },
      select: {
        id: true,
      },
    });
    if (!assignment) throw new NotFoundError('Assignment not found');
    return assignment.id;
  };

  create = async (params: { input: CreateClassroomTimetableReq; schoolId: string; classroomId: string }) => {
    const { input, schoolId, classroomId } = params;
    const assignmentId = await this.getAssignmentId({
      schoolId,
      classroomId,
      subjectId: input.subjectId,
    });
    const createdtimetable = await this.repo.create({ input, schoolId, assignmentId });
    const timetableResponse = TimetableMapper.toResponse(createdtimetable);
    return timetableResponse;
  };

  update = async (params: { input: updateTimetableRequest; timetableId: string; schoolId: string }) => {
    const { input, schoolId, timetableId } = params;
    const updatedtimetable = await this.repo.update({ input, schoolId, timetableId });
    const timetableResponse = TimetableMapper.toResponse(updatedtimetable);
    return timetableResponse;
  };

  delete = async (params: { timetableId: string; schoolId: string }) => {
    const { timetableId, schoolId } = params;
    return await this.repo.deleteMany({ timetableId, schoolId });
  };
}
