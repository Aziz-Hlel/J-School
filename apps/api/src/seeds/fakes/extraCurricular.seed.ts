import prisma from '@repo/db';

export class ExtracurricularSeed {
  run = async (params: { id: string; schoolId: string; name: string }) => {
    const { id, schoolId, name } = params;

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
