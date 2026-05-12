import { globalMediaService } from '@/media/media.service';
import { CursorQueryParams } from '@repo/contracts/schemas/const/cursorQueryParams';
import { CreatePostReq } from '@repo/contracts/schemas/extraCurricular/post/create';
import { PostResponse } from '@repo/contracts/schemas/extraCurricular/post/postResponse';
import { UpdatePostReq } from '@repo/contracts/schemas/extraCurricular/post/update';
import prisma from '@repo/db';

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
      take: cursorParams.limit,
      orderBy: { createdAt: 'desc' },
      cursor: cursorParams.cursor ? { id: cursorParams.cursor } : undefined,
      skip: cursorParams.cursor ? 1 : 0,
      include: { media: true },
    });
    const response: PostResponse[] = queryResult.map((s) => {
      const mediaResponses = s.media.map((media) => globalMediaService.toMediaResponse(media));
      return {
        id: s.id,
        content: s.content,
        media: mediaResponses,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      };
    });
    return response;
  };
}
