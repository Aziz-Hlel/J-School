import { z } from 'zod';

export const updateClassroomRequestSchema = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty('Class name is required')
      .min(1, 'Class name must be at least 1 characters long')
      .max(255, 'Class name must be at most 255 characters long'),
    description: z
      .string()
      .trim()
      .nonempty('Class description is required')
      .min(3, 'Class description must be at least 3 characters long')
      .max(255, 'Class description must be at most 255 characters long')
      .or(z.null()),
  })
  .strict();

export type UpdateClassroomRequest = z.infer<typeof updateClassroomRequestSchema>;
