import z from 'zod';

export const assignTeacherRequestSchema = z.object({
  teacherId: z.uuid(),
});

export type AssignTeacherRequest = z.infer<typeof assignTeacherRequestSchema>;
