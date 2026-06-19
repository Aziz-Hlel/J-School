import {
  EmergencyContactRes,
  StudentProfileResponse,
} from '@repo/contracts/schemas/studentProfile/studentProfileResponse';
import { EmergencyContact, Prisma } from '@repo/db/prisma/client';

export class StudentProfileMapper {
  private static toEmergencyContact(contact: EmergencyContact): EmergencyContactRes {
    return {
      name: contact.name,
      phone: contact.phone,
      relation: contact.relation,
    };
  }
  static toResponse(
    studentProfile: Prisma.StudentProfileGetPayload<{ include: { emergencyContacts: true } }>,
  ): StudentProfileResponse {
    const emergencyContactsResponse = studentProfile.emergencyContacts.map(this.toEmergencyContact);
    return {
      id: studentProfile.id,
      allergies: studentProfile.allergies,
      healthInfo: studentProfile.healthInfo,
      vaccine: studentProfile.vaccine,
      vaccineNotes: studentProfile.vaccineNotes,
      emergencyContacts: emergencyContactsResponse,
      notes: studentProfile.notes,
    };
  }
}
