import z from 'zod';
export const createTeacherCommentsReqSchema = z.object({
  studentIds: z.array(z.uuid()).max(100, 'At most 100 students are allowed'),
  title: z.string().min(1, 'Title is required').max(180, 'Title must be at most 180 characters'),
  content: z.string().min(1, 'Content is required').max(1000, 'Content must be at most 1000 characters'),
  canParentReply: z.boolean(),
});

export type CreateTeacherCommentsReq = z.infer<typeof createTeacherCommentsReqSchema>;
