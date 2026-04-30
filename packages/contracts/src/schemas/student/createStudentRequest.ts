import z from 'zod';
import { Gender, StudentStatus } from '../../types/enums/enums';

const baseSchema = z.object({
  uid: z
    .string()
    .trim()
    .transform((uid) => (uid === '' ? null : uid))
    .nullable(),

  dateOfBirth: z.iso
    .date()
    .nullable()
    .refine(
      (dateOfBirth) => {
        if (dateOfBirth === null) return true;
        return new Date(dateOfBirth) < new Date();
      },
      {
        message: 'Date of birth must be in the past',
        path: ['dateOfBirth'],
      },
    ),

  avatarId: z.uuid().nullable(),

  gender: z.enum(Gender),

  status: z.enum(StudentStatus),
});

export const studentFirstNameSchema = z.object({
  en: z.string().trim().nonempty('First name is required').max(255, 'First name is too long').or(z.null()),
  ar: z.string().trim().nonempty('First name is required').max(255, 'First name is too long').or(z.null()),
});

export const studentLastNameSchema = z.object({
  en: z.string().trim().nonempty('Last name is required').max(255, 'Last name is too long').or(z.null()),
  ar: z.string().trim().nonempty('Last name is required').max(255, 'Last name is too long').or(z.null()),
});

export const createStudentRequestSchema = baseSchema
  .and(z.object({ firstName: studentFirstNameSchema }))
  .and(z.object({ lastName: studentLastNameSchema }))
  .refine(
    (data) => {
      return (data.lastName.ar && data.firstName.ar) || (data.lastName.en && data.firstName.en);
    },
    {
      message: 'At least one language name is required',
      path: ['firstName.ar', 'lastName.ar', 'firstName.en', 'lastName.en'],
    },
  );

export type CreateStudentRequest = z.infer<typeof createStudentRequestSchema>;
