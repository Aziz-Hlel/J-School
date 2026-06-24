import { HomeworkType } from '@repo/db/prisma/enums';
import z from 'zod';
import { homeworkSchema } from '../shared/homework.schema';

export const createHomeworkReqSchema = z.object({
  title: homeworkSchema.title,
  content: homeworkSchema.content,
  files: z.array(z.uuid()).max(5, 'At most 5 files are allowed'),
  type: z.enum(HomeworkType),
  details: z.array(
    z.object({
      due: homeworkSchema.due,
      assignmentId: homeworkSchema.assignmentId,
      studentIds: z.array(z.uuid()).max(100, 'At most 100 students are allowed'),
    }),
  ),
});

export type CreateHomeworkReq = z.infer<typeof createHomeworkReqSchema>;
