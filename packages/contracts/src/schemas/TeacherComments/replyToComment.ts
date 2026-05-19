import z from 'zod';

export const replyToCommentReqSchema = z.object({
  reply: z.string().trim().nonempty('Comment cannot be empty').max(1000, 'Comment cannot be more than 1000 characters'),
});

export type ReplyToCommentReq = z.infer<typeof replyToCommentReqSchema>;
