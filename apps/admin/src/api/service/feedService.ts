import { apiRoutes } from '@/api/routes';
import type { Cursor } from '@repo/contracts/schemas/cursor/cursorResponse';
import type { CreateFeedReq } from '@repo/contracts/schemas/Feed/create';
import type { FeedResponse } from '@repo/contracts/schemas/Feed/response';
import type { UpdateFeedReq } from '@repo/contracts/schemas/Feed/update';
import { apiService } from '../apiService';

export const feedService = {
  getCursor: async (params: { schoolId: string; cursor: string | null }) =>
    apiService.getThrowable<Cursor<FeedResponse>>(apiRoutes.feed.get(params.schoolId), {
      params: { cursor: params.cursor, limit: 10 },
    }),

  // getById: async (schoolId: string, id: string) =>
  //   apiService.getThrowable<AnnouncementResponse>(apiRoutes.feed.getById(schoolId, id)),

  create: async (params: { schoolId: string; data: CreateFeedReq }) =>
    apiService.postThrowable<FeedResponse>(apiRoutes.feed.create(params.schoolId), params.data),

  update: async (params: { schoolId: string; id: string; data: UpdateFeedReq }) =>
    apiService.putThrowable<FeedResponse>(apiRoutes.feed.update(params.schoolId, params.id), params.data),

  delete: async (params: { schoolId: string; id: string }) =>
    apiService.deleteThrowable<void>(apiRoutes.feed.delete(params.schoolId, params.id)),
};
