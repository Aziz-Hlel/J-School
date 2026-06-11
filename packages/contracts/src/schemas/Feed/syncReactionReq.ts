import z from 'zod';
import { ReactionType } from '../../types/enums/enums';

export const syncReactionReqSchema = z.object({
  reaction: z.enum(ReactionType).nullable(),
});

export type SyncReactionReq = z.infer<typeof syncReactionReqSchema>;
