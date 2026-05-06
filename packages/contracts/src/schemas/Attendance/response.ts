import z from 'zod';
export const attendanceResponseSchema = z.object({
  //TODO: define schema
});

export type AttendanceResponse = z.infer<typeof attendanceResponseSchema>;
