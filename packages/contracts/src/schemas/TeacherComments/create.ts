import z from 'zod';
export const createTeacherCommentsReqSchema = z.object({
  studentIds: z.array(z.uuid()),
  title: z.string(),
  content: z.string(),
  canParentReply: z.boolean(),
});

export type CreateTeacherCommentsReq = z.infer<typeof createTeacherCommentsReqSchema>;
