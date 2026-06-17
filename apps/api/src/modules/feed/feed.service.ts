import { NotFoundError } from '@/err/service/customErrors';
import { CursorMapper } from '@/helper/cursor.mapper';
import { globalMediaService } from '@/media/media.service';
import type { CreateFeedReq } from '@repo/contracts/schemas/Feed/create';
import { FeedResponse } from '@repo/contracts/schemas/Feed/response';
import type { SyncReactionReq } from '@repo/contracts/schemas/Feed/syncReactionReq';
import { CursorQueryParams } from '@repo/contracts/schemas/cursor/cursorQueryParams';
import type { Cursor } from '@repo/contracts/schemas/cursor/cursorResponse';
import prisma from '@repo/db';
import { MediaStatus, ReactionType } from '@repo/db/prisma/enums';

export class FeedService {
  create = async (params: { schoolId: string; input: CreateFeedReq }) => {
    const { schoolId, input } = params;
    return await prisma.$transaction(async (tx) => {
      const createdAnnouncement = await tx.announcement.create({
        data: {
          title: input.title,
          description: input.description,
          schoolId,
        },
      });

      const inputMedia = input.media ?? [];

      const mediaIds = inputMedia.map((m) => m.id);
      const updateResults = await tx.media.updateMany({
        where: { id: { in: mediaIds } },
        data: {
          status: MediaStatus.CONFIRMED,
          annoucementId: createdAnnouncement.id,
        },
      });

      const orderUpdates = inputMedia.map((m) =>
        tx.media
          .update({
            where: { id: m.id },
            data: { order: m.order },
          })
          .catch(() => null),
      );

      await Promise.all(orderUpdates);

      const successfulCount = updateResults.count;
      const failedCount = inputMedia.length - successfulCount;

      return { failedCount, id: createdAnnouncement.id };
    });
  };

  update = async (params: { schoolId: string; input: CreateFeedReq; announcementId: string }) => {
    const { input, announcementId, schoolId } = params;
    return await prisma.$transaction(async (tx) => {
      const inputMedia = input.media ?? [];

      const mediaIds = inputMedia.map((m) => m.id);
      const updateResults = await tx.media.updateMany({
        where: { id: { in: mediaIds } },
        data: {
          status: MediaStatus.CONFIRMED,
          annoucementId: announcementId,
        },
      });

      const existingMediasIds = await tx.media.findMany({
        where: { id: { in: mediaIds } },
        select: { id: true },
      });

      const orderUpdates = inputMedia.map((m) =>
        tx.media
          .update({
            where: { id: m.id },
            data: { order: m.order },
          })
          .catch(() => null),
      );

      const updatedAnnoucement = await tx.announcement.update({
        where: { id: announcementId, schoolId },
        data: {
          title: input.title,
          description: input.description,
          media: {
            set: existingMediasIds,
          },
        },
      });

      await Promise.all(orderUpdates);

      const successfulCount = updateResults.count;
      const failedCount = inputMedia.length - successfulCount;

      return { failedCount, id: updatedAnnoucement.id };
    });
  };

  delete = async (params: { schoolId: string; announcementId: string }) => {
    const { schoolId, announcementId } = params;
    await prisma.announcement
      .delete({
        where: { id: announcementId, schoolId },
      })
      .catch(() => null);

    return;
  };

  find = async (params: {
    schoolId: string;
    accountId: string;
    query: CursorQueryParams;
  }): Promise<Cursor<FeedResponse>> => {
    const { schoolId, accountId, query } = params;

    const queryResponse = await prisma.announcement.findMany({
      take: query.limit + 1,
      cursor: query.cursor ? { id: query.cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      where: { schoolId },
      include: {
        media: { orderBy: { order: 'asc' } },
        reactions: {
          where: { user: { accountId } },
          select: { type: true },
        },
      },
    });

    const lastItem = queryResponse[query.limit];
    const nextCursor = lastItem?.id || null;
    const announcements = queryResponse.slice(0, query.limit);
    const announcementIds = announcements.map((a) => a.id);

    const reactionCounts = await prisma.reaction.groupBy({
      by: ['annoucementId', 'type'],
      where: {
        annoucementId: { in: announcementIds },
      },
      _count: {
        type: true,
      },
    });
    const likesCount: Map<string, number> = new Map();
    const heartCounts: Map<string, number> = new Map();

    reactionCounts.forEach((reactionCount) => {
      const map = reactionCount.type === ReactionType.LIKE ? likesCount : heartCounts;
      map.set(reactionCount.annoucementId, reactionCount._count.type);
    });

    const data: FeedResponse[] = announcements.map((announcement) => {
      return {
        id: announcement.id,
        title: announcement.title,
        description: announcement.description,
        media: announcement.media.map((m) => globalMediaService.toMediaResWithOrder(m)),
        reactions: {
          likesCount: likesCount.get(announcement.id) ?? 0,
          heartsCount: heartCounts.get(announcement.id) ?? 0,
          userReaction: announcement.reactions[0]?.type || null,
        },
        createdAt: announcement.createdAt.toISOString(),
        updatedAt: announcement.updatedAt.toISOString(),
      };
    });

    const cursor = CursorMapper.toCursor({ data, nextCursor });
    return cursor;
  };

  syncReaction = async (params: {
    schoolId: string;
    accountId: string;
    announcementId: string;
    input: SyncReactionReq;
  }) => {
    const { schoolId, accountId, announcementId, input } = params;
    return await prisma.$transaction(async (tx) => {
      const existingReaction = await tx.reaction.findFirst({
        where: {
          annoucementId: announcementId,
          user: { accountId },
        },
      });

      if (existingReaction && input.reaction !== null) {
        await tx.reaction.update({
          where: { id: existingReaction.id },
          data: { type: input.reaction },
        });
        return { action: 'updated' };
      }

      if (!existingReaction && input.reaction !== null) {
        const user = await tx.user.findUnique({
          where: { accountId_schoolId: { accountId, schoolId } },
          select: { id: true },
        });

        if (!user) throw new NotFoundError('User not found');

        await tx.reaction.create({
          data: {
            annoucementId: announcementId,
            userId: user.id,
            type: input.reaction,
          },
        });
        return { action: 'created' };
      }

      if (existingReaction && input.reaction === null) {
        await tx.reaction.delete({
          where: { id: existingReaction.id },
        });
        return { action: 'deleted' };
      }

      return { action: 'nothing' };
    });
  };
}
