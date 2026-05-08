import type { ReactionType } from '../../types/enums/enums';
import type { MediaResponse } from '../media/MediaResponse';

export type FindAnnouncementsResponse = {
  id: string;
  description: string | null;
  media: (MediaResponse & { order: number })[];
  reactions: {
    likeCount: number;
    heartCount: number;
    userReaction: ReactionType | null;
  };

  createdAt: string;
  updatedAt: string;
};
