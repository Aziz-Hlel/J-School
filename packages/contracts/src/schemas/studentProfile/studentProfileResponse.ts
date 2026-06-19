import type { VaccineStatus } from '@repo/db/prisma/enums';

export type EmergencyContactRes = {
  name: string;
  phone: string;
  relation: string;
};

export type StudentProfileResponse = {
  id: string;

  allergies: string | null;
  healthInfo: string | null;
  vaccine: VaccineStatus;
  vaccineNotes: string | null;

  emergencyContacts: EmergencyContactRes[];

  notes: string | null;
};
