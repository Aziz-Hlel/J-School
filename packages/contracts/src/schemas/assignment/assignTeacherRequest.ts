import z from 'zod';

export const assignTeacherRequestSchema = z.object({
  teacherId: z.uuid().nullable(),
});

export type AssignTeacherRequestInput = z.infer<typeof assignTeacherRequestSchema>;
