import z from 'zod';

export const AssignStudentRequestSchema = z.object({
  studentId: z.string(),
});
export type AssignStudentRequestInput = z.infer<typeof AssignStudentRequestSchema>;
