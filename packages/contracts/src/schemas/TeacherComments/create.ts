import z from 'zod';
export const createTeacherCommentsReqSchema = z.object({
  studentId: z.uuid(),
  title: z.string(),
  content: z.string(),
  canParentReply: z.boolean(),
});

export type CreateTeacherCommentsReq = z.infer<typeof createTeacherCommentsReqSchema>;
