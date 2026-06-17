import prisma from '@repo/db';
import { ClassGrade } from '@repo/db/prisma/enums';

export class ExtracurricularSeed {
  run = async (params: { id: string; schoolId: string; name: string; grade: ClassGrade }) => {
    const { id, schoolId, name, grade } = params;

    await prisma.extraCurricular.upsert({
      where: { id },
      create: {
        id,
        schoolId,
        title: {
          create: {
            en: name,
            fr: name,
            ar: name,
          },
        },
        grade,
      },
      update: {},
    });
  };

  assignTeacher = async (params: { schoolId: string; extraCurricularId: string; teacherEmail: string }) => {
    const { schoolId, extraCurricularId, teacherEmail } = params;

    const teacher = await prisma.teacher.findFirst({
      where: {
        user: {
          account: { email: teacherEmail },
          schoolId,
        },
      },
      select: { id: true },
    });

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    const row = await prisma.extraCurricular.update({
      where: {
        id: extraCurricularId,
        schoolId,
      },
      data: {
        teacherId: teacher.id,
      },
    });
    return row;
  };

  assignStudent = async (params: { schoolId: string; extraCurricularId: string; studentId: string }) => {
    const { schoolId, extraCurricularId, studentId } = params;

    const row = await prisma.studentExtraCurricular.upsert({
      where: { studentId_extraCurricularId: { studentId, extraCurricularId } },
      create: {
        extraCurricularId,
        studentId,
        schoolId,
      },
      update: {},
    });
    return row;
  };
}
