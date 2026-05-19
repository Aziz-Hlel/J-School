import { toCalendarDate } from '@/utils/dayjs';
import { AftercareResponse } from '@repo/contracts/schemas/Aftercare/response';
import { AftercareGetPayload } from '@repo/db/prisma/models';
import { TeacherMapper } from '../teacher/teacher.mapper';
import { StudentMapper } from '../student/student.mapper';

export class AftercareMapper {
  static toResponse(
    aftercare: AftercareGetPayload<{
      include: {
        supervisor: { include: { user: { include: { account: { include: { avatar: true } } } } } };
        students: { include: { avatar: true; classroom: true } };
      };
    }>,
  ): AftercareResponse {
    return {
      id: aftercare.id,
      date: toCalendarDate(aftercare.date),
      supervisor: TeacherMapper.toResponse(aftercare.supervisor),
      students: aftercare.students.map((student) => StudentMapper.toResponse2(student)),
      createdAt: aftercare.createdAt.toISOString(),
      updatedAt: aftercare.updatedAt.toISOString(),
    };
  }
}
