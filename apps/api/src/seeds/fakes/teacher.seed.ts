import { prisma } from '@/bootstrap/db.init';
import { TX } from '@/types/prisma/PrismaTransaction';
import { ClassGrade } from '@repo/db/prisma/enums';

export class TeacherSeed {
  runV2 = async (params: { teacherId: string; userId: string }, tx?: TX) => {
    const { teacherId, userId } = params;
    const client = tx ?? prisma;
    const teacher = await client.teacher.upsert({
      where: { id: teacherId },
      update: {},
      create: {
        id: teacherId,
        userId,
      },
    });

    return teacher;
  };

  run = async (params: { userId: string }, tx?: TX) => {
    const { userId } = params;
    const client = tx ?? prisma;
    const teacher = await client.teacher.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
    });

    return teacher;
  };

  addToAssignment = async (
    params: {
      teacherEmail: string;
      schoolId: string;
      subjectNameEn: string;
      classroomName: string;
      grade: ClassGrade;
    },
    tx?: TX,
  ) => {
    const { teacherEmail, schoolId, subjectNameEn, classroomName, grade } = params;
    const client = tx ?? prisma;

    const teacher = await client.teacher.findFirst({
      where: {
        user: {
          account: {
            email: teacherEmail,
          },
          schoolId,
        },
      },
    });
    if (!teacher) throw new Error('Teacher not found');

    const assignment = await client.assignment.findFirst({
      where: {
        schoolId,
        classroom: {
          name: classroomName,
        },
        subject: {
          name_en: subjectNameEn,
          schoolId,
          grade,
        },
      },
    });

    if (!assignment) throw new Error('Assignment not found');

    await client.assignment.update({
      where: {
        id: assignment.id,
      },
      data: {
        teacherId: teacher.id,
      },
    });
  };
}
