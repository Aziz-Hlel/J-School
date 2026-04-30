import { StudentProfile } from '@repo/db/prisma/client';
import {
  EmergencyContact,
  StudentProfileResponse,
} from '@repo/contracts/schemas/studentProfile/studentProfileResponse';

export class StudentProfileMapper {
  private static toEmergencyContact(studentProfile: StudentProfile): EmergencyContact[] {
    const emergencyContacts: EmergencyContact[] = [];
    if (studentProfile.emergencyContactName1) {
      emergencyContacts.push({
        name: studentProfile.emergencyContactName1,
        phone: studentProfile.emergencyContactPhone1,
        relation: studentProfile.emergencyContactRelation1,
      });
    }
    if (studentProfile.emergencyContactName2) {
      emergencyContacts.push({
        name: studentProfile.emergencyContactName2,
        phone: studentProfile.emergencyContactPhone2,
        relation: studentProfile.emergencyContactRelation2,
      });
    }
    return emergencyContacts;
  }
  static toResponse(studentProfile: StudentProfile): StudentProfileResponse {
    const emergencyContactsResponse = this.toEmergencyContact(studentProfile);
    return {
      id: studentProfile.id,
      allergies: studentProfile.allergies,
      healthInfo: studentProfile.healthInfo,
      vaccine: studentProfile.vaccine,
      cpr: studentProfile.cpr,
      emergencyContacts: emergencyContactsResponse,
      notes: studentProfile.notes,
    };
  }
}
