import z from 'zod';

export const assignStudentToClassroomReqSchema = z.object({
  classroomId: z.uuid().nullable(),
});

export type AssignStudentToClassroomReq = z.infer<typeof assignStudentToClassroomReqSchema>;
