import z from 'zod';
import { Gender } from '../../../types/enums/enums';
import { dateStringSchema } from '../../utils/generalZod';

export const createUserV2Schema = z.object({
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

  dateOfBirth: dateStringSchema('Invalid date of birth').or(z.null()), // * has to be in the past

  phone: z
    .string()
    .trim()
    .min(7, 'Phone must be at least 7 characters long')
    .max(30, 'Phone must be at most 30 characters long')
    .or(z.null()), // * add regex validation for phone number

  cin: z
    .string()
    .trim()
    .min(8, 'Cin must be at least 8 characters long')
    .max(8, 'Cin must be at most 8 characters long')
    .or(z.null()),

  address: z
    .string()
    .trim()
    .min(3, 'Address must be at least 3 characters long')
    .max(255, 'Address must be at most 255 characters long')
    .or(z.null()),

  email: z.email('Invalid email').max(255, 'Email must be at most 255 characters long'),

  password: z
    .string()
    .trim()
    .min(8, 'Password must be at least 8 characters long')
    .max(255, 'Password must be at most 255 characters long')
    .or(z.null()),
});

export type CreateUserV2 = z.infer<typeof createUserV2Schema>;
