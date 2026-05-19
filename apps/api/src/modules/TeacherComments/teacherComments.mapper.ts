import { globalMediaService } from '@/media/media.service';
import { TeacherCommentsResponse } from '@repo/contracts/schemas/TeacherComments/response';
import { TeacherCommentGetPayload } from '@repo/db/prisma/models';

export class TeacherCommentsMapper {
  static toResponse(
    teacherComment: TeacherCommentGetPayload<{
      include: {
        student: true;
        teacher: {
          include: {
            user: { select: { account: { select: { avatar: true } }; firstName: true; lastName: true; id: true } };
          };
        };
      };
    }>,
  ): TeacherCommentsResponse {
    const teacherAvatar = globalMediaService.toMediaResponse(teacherComment.teacher.user.account.avatar);
    return {
      id: teacherComment.id,
      title: teacherComment.title,
      content: teacherComment.content,
      canParentReply: teacherComment.canParentReply,
      parentReply: teacherComment.parentReply,
      teacher: {
        id: teacherComment.teacher.id,
        firstName: teacherComment.teacher.user.firstName,
        lastName: teacherComment.teacher.user.lastName,
        avatar: teacherAvatar,
      },
      student: {
        id: teacherComment.student.id,
        firstName: { en: teacherComment.student.firstName_en, ar: teacherComment.student.firstName_ar },
        lastName: { en: teacherComment.student.lastName_en, ar: teacherComment.student.lastName_ar },
        avatar: teacherAvatar,
      },
      createdAt: teacherComment.createdAt.toISOString(),
      updatedAt: teacherComment.updatedAt.toISOString(),
    };
  }
}
