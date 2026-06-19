import z from 'zod';
import { globalStudentProfileSchema } from '../shared/studentProfile.schema';

export const createStudentProfileRequestSchema = z.object({
  healthInfo: globalStudentProfileSchema.healthInfo,

  vaccine: globalStudentProfileSchema.vaccine,

  vaccineNotes: globalStudentProfileSchema.vaccineNotes,

  allergies: globalStudentProfileSchema.allergies,

  notes: globalStudentProfileSchema.notes,

  emergencyContacts: globalStudentProfileSchema.emergencyContacts,
});

export type CreateStudentProfileRequest = z.infer<typeof createStudentProfileRequestSchema>;
