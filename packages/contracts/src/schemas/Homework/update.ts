import { homeworkSchema } from '../shared/homework.schema';
import z from 'zod';
export const updateHomeworkReqSchema = z.object({
  title: homeworkSchema.title,
  content: homeworkSchema.content,
  files: z.array(z.uuid()),
  due: homeworkSchema.due,
  assignmentId: homeworkSchema.assignmentId,
  studentIds: z.array(z.uuid()),
});

export type UpdateHomeworkReq = z.infer<typeof updateHomeworkReqSchema>;
