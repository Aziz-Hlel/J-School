import z from 'zod';
export const attendanceUpdateDto = z.object({
  //TODO: define schema
});

export type AttendanceUpdateInput = z.infer<typeof attendanceUpdateDto>;
