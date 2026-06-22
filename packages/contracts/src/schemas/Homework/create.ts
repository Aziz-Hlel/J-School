import z from 'zod';
import { homeworkSchema } from '../shared/homework.schema';

export const createHomeworkReqSchema = z.object({
  title: homeworkSchema.title,
  content: homeworkSchema.content,
  files: z.array(z.uuid()),
  details: z.array(
    z.object({
      due: homeworkSchema.due,
      assignmentId: homeworkSchema.assignmentId,
      studentIds: z.array(z.uuid()),
    }),
  ),
});

export type CreateHomeworkReq = z.infer<typeof createHomeworkReqSchema>;
