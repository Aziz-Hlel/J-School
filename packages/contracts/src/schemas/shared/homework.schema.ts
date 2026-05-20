import z from 'zod';

export const homeworkSchema = {
  title: z
    .string()
    .trim()
    .max(255, 'Title must be less than 255 characters')
    .nullable()
    .transform((value) => value || null),
  content: z
    .string()
    .trim()
    .max(5000, 'Content must be less than 5000 characters')
    .nullable()
    .transform((value) => value || null),
  due: z.iso.date(),
  assignmentId: z.uuid(),
  schoolId: z.uuid(),
  classroomId: z.uuid(),
};
