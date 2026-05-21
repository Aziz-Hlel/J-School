import { parseCalendarDate } from '@/utils/dayjs';
import prisma from '@repo/db';
import { ClassGrade } from '@repo/db/prisma/browser';

export class HomeworkSeed {
  run = async (params: {
    schoolId: string;
    id: string;
    studentIds: string[];
    title: string;
    content: string;
    fileIds: string[];
    due: string;
    subjectNameEn: string;
    classroomName: string;
    grade: ClassGrade;
  }) => {
    const assignment = await prisma.assignment.findFirst({
      where: {
        schoolId: params.schoolId,
        classroom: {
          name: params.classroomName,
        },
        subject: {
          name_en: params.subjectNameEn,
          schoolId: params.schoolId,
          grade: params.grade,
        },
      },
      select: { id: true },
    });
    if (!assignment) throw new Error('Assignment not found');

    return await prisma.homework.upsert({
      where: {
        id: params.id,
      },
      update: {},
      create: {
        id: params.id,
        assignmentId: assignment.id,
        due: parseCalendarDate(params.due),
        studentHomeworks: {
          createMany: {
            data: params.studentIds.map((id) => ({ studentId: id })),
          },
        },
        title: params.title,
        content: params.content,
        files: {
          connect: params.fileIds.map((id) => ({ id })),
        },
        schoolId: params.schoolId,
      },
    });
  };
}
