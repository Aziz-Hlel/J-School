export type EmergencyContact = {
  name: string | null;
  phone: string | null;
  relation: string | null;
};

export type StudentProfileResponse = {
  id: string;

  allergies: string | null;
  healthInfo: string | null;
  vaccine: string | null;
  cpr: string | null;

  emergencyContacts: EmergencyContact[];

  notes: string | null;
};
