import { prisma } from '@/bootstrap/db.init';
import { NotFoundError } from '@/err/service/customErrors';
import { parseCalendarDate } from '@/utils/dayjs';
import { SyncAftercareReq } from '@repo/contracts/schemas/Aftercare/sync';
import { SyncAftercareQueryParam } from '@repo/contracts/schemas/Aftercare/syncQueryParam';
import dayjs from 'dayjs';
import { AftercareMapper } from './aftercare.mapper';

export class AftercareService {
  constructor() {}
  sync = async (params: { schoolId: string; input: SyncAftercareReq }) => {
    const { schoolId, input } = params;

    const studentsExistingRows = await prisma.student.findMany({
      where: {
        id: {
          in: input.students,
        },
        schoolId,
      },
      select: {
        id: true,
      },
    });

    const studentConnections = studentsExistingRows.map((student) => ({ id: student.id }));

    const syncedAftercare = await prisma.aftercare.upsert({
      where: {
        schoolId_date: {
          schoolId,
          date: input.date,
          sex: '',
        },
      },
      create: {
        schoolId,
        date: input.date,
        supervisorId: input.supervisorId,
        students: {
          connect: studentConnections,
        },
      },
      update: {
        supervisorId: input.supervisorId,
        students: {
          set: studentConnections,
        },
      },
    });

    return syncedAftercare;
  };

  findByDate = async (params: { schoolId: string; input: SyncAftercareQueryParam }) => {
    const { schoolId, input } = params;

    const dateOrCurrent = input.date ? parseCalendarDate(input.date) : dayjs().toDate();

    const aftercare = await prisma.aftercare.findUnique({
      where: {
        schoolId_date: {
          schoolId,
          date: dateOrCurrent,
        },
      },
      include: {
        supervisor: { include: { user: { include: { account: { include: { avatar: true } } } } } },
        students: { include: { avatar: true, classroom: true } },
      },
    });

    if (!aftercare) throw new NotFoundError('Aftercare not found');

    const response = AftercareMapper.toResponse(aftercare);
    return response;
  };
}
