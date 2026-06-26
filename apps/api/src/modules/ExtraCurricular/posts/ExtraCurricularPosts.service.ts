import { CursorMapper } from '@/helper/cursor.mapper';
import { globalMediaService } from '@/media/media.service';
import { globalNotificationService } from '@/modules/Notification/notification.service';
import { extraCurricularPostNotification } from '@/template/notification/extraCurricularPost';
import { CursorQueryParams } from '@repo/contracts/schemas/cursor/cursorQueryParams';
import { CreatePostReq } from '@repo/contracts/schemas/extraCurricular/post/create';
import { PostResponse } from '@repo/contracts/schemas/extraCurricular/post/postResponse';
import { UpdatePostReq } from '@repo/contracts/schemas/extraCurricular/post/update';
import prisma from '@repo/db';
import { NotificationSourceType, NotificationType } from '@repo/db/prisma/browser';

export class ExtraCurricularPostsService {
  create = async (params: { schoolId: string; extraCurricularId: string; post: CreatePostReq }) => {
    const { schoolId, extraCurricularId, post } = params;
    const createdPost = await prisma.post.create({
      data: {
        schoolId,
        extraCurricularId,
        content: post.content,
        media: {
          connect: post.mediaIds?.map((mediaId) => ({ id: mediaId })),
        },
      },
    });

    try {
      const extraCurricular = await prisma.extraCurricular.findUnique({
        where: {
          id: extraCurricularId,
        },
        select: {
          title: true,
          id: true,
        },
      });
      const activityName = extraCurricular?.title
        ? {
            en: extraCurricular.title.en,
            ar: extraCurricular.title.ar,
            fr: extraCurricular.title.fr,
          }
        : undefined;

      const parents = await prisma.studentExtraCurricular.findMany({
        where: {
          extraCurricularId,
        },
        select: {
          student: {
            select: {
              parents: {
                select: {
                  parent: {
                    select: {
                      user: {
                        select: {
                          account: {
                            select: {
                              id: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      await globalNotificationService.create({
        input: {
          schoolId,
          sourceId: createdPost.id,
          type: {
            type: NotificationType.GROUP,
            accountIds: parents.flatMap((x) => x.student.parents).map((x) => x.parent.user.account.id),
          },
          title: extraCurricularPostNotification.title(),
          content: extraCurricularPostNotification.content({ activityName }),
          sourceType: NotificationSourceType.EXTRA_CURRICULAR,
        },
      });
    } catch (error) {}
    return createdPost;
  };

  update = async (params: { schoolId: string; extraCurricularId: string; postId: string; post: UpdatePostReq }) => {
    const { schoolId, extraCurricularId, postId, post } = params;
    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
        schoolId,
        extraCurricularId,
      },
      data: {
        content: post.content,
        media: {
          set: post.mediaIds?.map((mediaId) => ({ id: mediaId })),
        },
      },
    });
    return updatedPost;
  };

  delete = async (params: { schoolId: string; extraCurricularId: string; postId: string }) => {
    const { schoolId, extraCurricularId, postId } = params;
    await prisma.post
      .delete({
        where: {
          id: postId,
          schoolId,
          extraCurricularId,
        },
      })
      .catch(() => null);
    return true;
  };

  findAll = async (params: { schoolId: string; extraCurricularId: string; cursorParams: CursorQueryParams }) => {
    const { schoolId, extraCurricularId, cursorParams } = params;
    const queryResult = await prisma.post.findMany({
      where: {
        schoolId,
        extraCurricularId,
      },
      take: cursorParams.limit + 1,
      orderBy: { createdAt: 'desc' },
      cursor: cursorParams.cursor ? { id: cursorParams.cursor } : undefined,
      include: { media: true },
    });
    const response: PostResponse[] = queryResult.slice(0, cursorParams.limit).map((s) => {
      const mediaResponses = s.media.map((media) => globalMediaService.toMediaRes(media));
      return {
        id: s.id,
        content: s.content,
        media: mediaResponses,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      };
    });
    const lastItem = queryResult[cursorParams.limit];
    const nextCursor = lastItem?.id || null;

    const cursorResponse = CursorMapper.toCursor({ data: response, nextCursor });
    return cursorResponse;
  };
}
