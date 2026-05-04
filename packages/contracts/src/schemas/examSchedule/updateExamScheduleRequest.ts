import z from 'zod';

export const updateExamScheduleRequestSchema = z.object({
  examId: z.uuid(),
  classroomId: z.uuid(),
  date: z
    .object({
      day: z.iso.date(),
      startTime: z.iso.time(),
      endTime: z.iso.time(),
    })
    .refine((data) => data.endTime > data.startTime, {
      message: 'End time must be after start time',
      path: ['endTime', 'startTime'],
    })
    .or(z.null()),
});

export type UpdateExamScheduleRequest = z.infer<typeof updateExamScheduleRequestSchema>;
