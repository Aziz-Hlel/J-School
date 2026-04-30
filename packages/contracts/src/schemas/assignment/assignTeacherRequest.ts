import z from 'zod';

export const assignTeacherRequestSchema = z.object({
  teacherId: z.uuid(),
});

export type AssignTeacherRequestInput = z.infer<typeof assignTeacherRequestSchema>;
