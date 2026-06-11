import { apiRoutes } from '@/api/routes';
import type { AnnouncementResponse } from '@repo/contracts/schemas/Feed/response';
import type { Cursor } from '@repo/contracts/schemas/cursor/cursorResponse';
import { apiService } from '../apiService';

export const feedService = {
  getCursor: async (params: { schoolId: string; cursor: string | null }) =>
    apiService.getThrowable<Cursor<AnnouncementResponse>>(apiRoutes.feed.get(params.schoolId), {
      params: { cursor: params.cursor, limit: 1 },
    }),

  // getById: async (schoolId: string, id: string) =>
  //   apiService.getThrowable<AnnouncementResponse>(apiRoutes.feed.getById(schoolId, id)),

  // create: async (params: { schoolId: string; data: CreateClassroomReq }) =>
  //   apiService.postThrowable<AnnouncementResponse>(apiRoutes.feed.create(params.schoolId), params.data),

  // update: async (params: { schoolId: string; id: string; data: UpdateClassroomReq }) =>
  //   apiService.putThrowable<AnnouncementResponse>(apiRoutes.feed.update(params.schoolId, params.id), params.data),

  // delete: async (params: { schoolId: string; id: string }) =>
  //   apiService.deleteThrowable<void>(apiRoutes.classrooms.delete(params.schoolId, params.id)),
};
