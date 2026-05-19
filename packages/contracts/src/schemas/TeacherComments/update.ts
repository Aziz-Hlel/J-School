import z from 'zod';
export const updateTeacherCommentsReqSchema = z.object({
  title: z.string(),
  content: z.string(),
  canParentReply: z.boolean(),
});

export type UpdateTeacherCommentsReq = z.infer<typeof updateTeacherCommentsReqSchema>;
