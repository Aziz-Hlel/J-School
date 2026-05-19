import prisma from '@repo/db';

export class TeacherCommentSeed {
  run = async (params: {
    id: string;
    teacherId: string;
    studentId: string;
    schoolId: string;
    title: string;
    content: string;
    parentReply?: string;
  }): Promise<void> => {
    const { schoolId, id, studentId, teacherId, title, content, parentReply } = params;
    await prisma.teacherComment.upsert({
      where: {
        id,
      },
      update: {},
      create: {
        schoolId,
        studentId,
        teacherId,
        title,
        content,
        canParentReply: false,
        parentReply,
      },
    });
  };
}
