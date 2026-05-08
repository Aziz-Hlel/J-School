import { globalMediaService } from '@/media/media.service';
import { AnnouncementQueryParamInput } from '@repo/contracts/schemas/Announcement/announcementQueryParam';
import type { CreateAnnouncementReq } from '@repo/contracts/schemas/Announcement/create';
import { AnnouncementResponse } from '@repo/contracts/schemas/Announcement/response';
import prisma from '@repo/db';
import { MediaStatus, ReactionType } from '@repo/db/prisma/enums';
import type { SyncReactionReq } from '@repo/contracts/schemas/Announcement/syncReactionReq';
import { NotFoundError } from '@/err/service/customErrors';

export class AnnouncementService {
  create = async (params: { schoolId: string; input: CreateAnnouncementReq }) => {
    const { schoolId, input } = params;
    return await prisma.$transaction(async (tx) => {
      const createdAnnouncement = await tx.announcement.create({
        data: {
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

  update = async (params: { schoolId: string; input: CreateAnnouncementReq; announcementId: string }) => {
    const { input, announcementId, schoolId } = params;
    return await prisma.$transaction(async (tx) => {
      const updatedAnnoucement = await tx.announcement.update({
        where: { id: announcementId, schoolId },
        data: {
          description: input.description,
        },
      });

      const inputMedia = input.media ?? [];

      const mediaIds = inputMedia.map((m) => m.id);
      const updateResults = await tx.media.updateMany({
        where: { id: { in: mediaIds } },
        data: {
          status: MediaStatus.CONFIRMED,
          annoucementId: updatedAnnoucement.id,
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

      return { failedCount, id: updatedAnnoucement.id };
    });
  };

  delete = async (params: { schoolId: string; announcementId: string }) => {
    const { schoolId, announcementId } = params;
    await prisma.announcement
      .delete({
        where: { id: announcementId, schoolId },
      })
      .catch(null);

    return;
  };

  find = async (params: {
    schoolId: string;
    accountId: string;
    query: AnnouncementQueryParamInput;
  }): Promise<AnnouncementResponse[]> => {
    const { schoolId, accountId, query } = params;

    const announcements = await prisma.announcement.findMany({
      take: query.limit,
      skip: query.cursor ? 1 : 0,
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

    const reactionCountsMap = reactionCounts.reduce((acc, rc) => {
      acc.set(rc.annoucementId, rc);
      return acc;
    }, new Map<string, { annoucementId: string; type: ReactionType; _count: { type: number } }>());

    const response: AnnouncementResponse[] = announcements.map((announcement) => {
      const counts = reactionCountsMap.get(announcement.id);
      return {
        id: announcement.id,
        description: announcement.description,
        media: announcement.media.map((m) => globalMediaService.generateMediaResponse_V2(m)),
        reactions: {
          likesCount: counts?.type === 'LIKE' ? counts._count.type : 0,
          heartsCount: counts?.type === 'HEART' ? counts._count.type : 0,
          userReaction: announcement.reactions[0]?.type || null,
        },
        createdAt: announcement.createdAt.toISOString(),
        updatedAt: announcement.updatedAt.toISOString(),
      };
    });

    return response;
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
