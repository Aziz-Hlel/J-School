import z from 'zod';
export const attendanceCreateDto = z.object({
  //TODO: define schema
});

export type AttendanceCreateInput = z.infer<typeof attendanceCreateDto>;
