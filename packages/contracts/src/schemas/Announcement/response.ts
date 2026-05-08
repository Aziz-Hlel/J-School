import z from 'zod';
import { MediaType, ReactionType } from '../../types/enums/enums';

export const announcementResponseSchema = z.object({
  id: z.uuid(),
  description: z.string().nullable(),
  media: z.array(
    z.object({
      id: z.uuid(),
      url: z.string(),
      order: z.number().int().min(0).max(50).nullable(),
      type: z.enum(MediaType),
    }),
  ),
  reactions: z.object({
    likesCount: z.number(),
    heartsCount: z.number(),
    userReaction: z.enum(ReactionType).nullable(),
  }),
  //   publisher : z.object({
  //   id: z.uuid(),
  //   firstName: z.string(),
  //   lastName: z.string(),
  //   avatar: z.string().nullable(),
  // }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type AnnouncementResponse = z.infer<typeof announcementResponseSchema>;
