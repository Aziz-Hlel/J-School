import z from 'zod';

export const createEmergencyContactRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty('Emergency contact name is required')
    .max(255, 'Emergency contact name must be at most 255 characters'),

  phone: z
    .string()
    .trim()
    .nonempty('Emergency contact phone is required')
    .max(20, 'Emergency contact phone must be at most 20 characters'), // *

  relation: z
    .string()
    .trim()
    .nonempty('Emergency contact relation is required')
    .max(255, 'Emergency contact relation must be at most 255 characters')
    .or(z.null()),
});

export type CreateEmergencyContactRequest = z.infer<typeof createEmergencyContactRequestSchema>;

export const createStudentProfileRequestSchema = z.object({
  healthInfo: z
    .string()
    .trim()
    .nonempty('Health info is required')
    .max(1000, 'Health info must be at most 1000 characters')
    .or(z.null()),

  vaccine: z
    .string()
    .trim()
    .nonempty('Vaccine is required')
    .max(1000, 'Vaccine must be at most 1000 characters')
    .or(z.null()),

  cpr: z.string().trim().nonempty('CPR is required').max(1000, 'CPR must be at most 1000 characters').or(z.null()),

  allergies: z
    .string()
    .trim()
    .nonempty('Allergies is required')
    .max(1000, 'Allergies must be at most 1000 characters')
    .or(z.null()),

  notes: z
    .string()
    .trim()
    .nonempty('Notes is required')
    .max(1000, 'Notes must be at most 1000 characters')
    .or(z.null()),

  emergencyContacts: z
    .array(createEmergencyContactRequestSchema)
    .max(2, 'Emergency contacts must be at most 2')
    .nullable(),
});

export type CreateStudentProfileRequest = z.infer<typeof createStudentProfileRequestSchema>;
