import z from 'zod';
import { studentFirstNameSchema, studentLastNameSchema } from '../createStudentRequest';
import { Gender } from '../../../types/enums/enums';

export const createMinimalWithParentSchema = z.object({
  student: z
    .object({
      classroomId: z.uuid(),
    })
    .and(z.object({ firstName: studentFirstNameSchema }))
    .and(z.object({ lastName: studentLastNameSchema }))
    .refine(
      (data) => {
        return (data.lastName.ar && data.firstName.ar) || (data.lastName.en && data.firstName.en);
      },
      {
        message: 'At least one language name is required',
        path: ['firstName', 'lastName'],
      },
    ),
  parent: z.object({
    email: z.email(),
    password: z.string().min(6),
    firstName: z
      .string()
      .trim()
      .nonempty('First name is required')
      .min(3, 'First name must be at least 3 characters long')
      .max(255, 'First name must be at most 255 characters long'),

    lastName: z
      .string()
      .trim()
      .nonempty('Last name is required')
      .min(3, 'Last name must be at least 3 characters long')
      .max(255, 'Last name must be at most 255 characters long'),

    gender: z.enum(Gender),
  }),
});
