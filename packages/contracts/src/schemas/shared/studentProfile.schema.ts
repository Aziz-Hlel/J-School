import { VaccineStatus } from '@repo/db/prisma/enums';
import { z } from 'zod';

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
    .max(255, 'Emergency contact relation must be at most 255 characters'),
});

export const globalStudentProfileSchema = {
  healthInfo: z
    .string()
    .trim()
    .nonempty('Health info is required')
    .max(1000, 'Health info must be at most 1000 characters')
    .or(z.null()),

  vaccine: z.enum(VaccineStatus),

  vaccineNotes: z
    .string()
    .trim()
    .max(1000, 'Vaccine notes must be at most 1000 characters')
    .nullable()
    .transform((val) => val || null),

  allergies: z
    .string()
    .trim()
    .max(1000, 'Allergies must be at most 1000 characters')
    .nullable()
    .transform((val) => val || null),

  notes: z
    .string()
    .trim()
    .max(1000, 'Notes must be at most 1000 characters')
    .nullable()
    .transform((val) => val || null),

  emergencyContacts: z.array(createEmergencyContactRequestSchema).max(2, 'Emergency contacts must be at most 2'),
};
