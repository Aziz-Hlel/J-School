import type { VaccineStatus } from '@repo/db/prisma/enums';

export type EmergencyContactRes = {
  name: string;
  phone: string;
  relation: string;
};

export type StudentProfileResponse = {
  id: string;

  healthInfo: string | null;
  vaccine: VaccineStatus;
  allergies: string | null;
  notes: string | null;

  emergencyContacts: EmergencyContactRes[];
};
