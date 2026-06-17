import type { Gender, Status } from '../api.types';
import type { UserRole } from '../auth/auth.types';
import type { ClassroomType } from '../classroom/classroom.types';
import type { MaritalStatus } from '../parents/parent.types';
import type { Media } from '../storage/storage.types';

export type Student = {
  id: string;
  name: string;
  gender: Gender;
  status: Status;
  avatar: Media | null;
  updatedAt: string;
  createdAt: string;
  media: Media[];
  classroom: {
    id: string;
    title: string;
  } | null;
};

export type StudentById = {
  id: string;
  name: string;
  gender: Gender;
  status: Status;
  birthDate: string;
  inscriptionDate: string;
  nationality: string | null;
  avatar: Media | null;
  createdAt: string;
  updatedAt: string;
  healthInfo: {
    id: string;
    vaccine: VaccineProgress;
    doctorName: string | null;
    doctorPhone: string | null;
    studentId: string;
    createdAt: string;
    updatedAt: string;
    medicalConditions: {
      id: string;
      healthInfoId: string;
      type: MedicalConditionType;
      details: string | null;
      createdAt: string;
      updatedAt: string;
    }[];
    emergencyContacts: {
      id: string;
      healthInfoId: string;
      name: string;
      phone: string;
      createdAt: string;
      updatedAt: string;
    }[];
  };
  classroom: {
    id: string;
    title: string;
    type: ClassroomType;
  } | null;
  studentDocuments: {
    media: Media[];
  } | null;
  parents: {
    id: string;
    phone: string | null;
    gender: Gender | null;
    cin: string | null;
    address: string | null;
    profession: string | null;
    maritalStatus: MaritalStatus | null;
    userId: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      email: string;
      name: string;
      emailVerified: boolean;
      disabledAt: string | null;
      deletedAt: string | null;
      status: Status;
      role: UserRole;
    };
  }[];
  familyMembers: {
    name: string;
    phone: string;
    description?: string | null;
  }[];
};

export const VaccineProgress = {
  COMPLETE: 'COMPLETE',
  UNCOMPLETE: 'UNCOMPLETE',
} as const;

export type VaccineProgress = (typeof VaccineProgress)[keyof typeof VaccineProgress];

export const MedicalConditionType = {
  ALLERGY: 'ALLERGY',
  VISION: 'VISION',
  SPEECH: 'SPEECH',
  CHRONIC: 'CHRONIC',
  TREATMENT: 'TREATMENT',
} as const;

export type MedicalConditionType = (typeof MedicalConditionType)[keyof typeof MedicalConditionType];

export interface StudentForSelection {
  id: string;
  name: string;
  avatar: Media | null;
  gender: Gender;
  classroom: {
    id: string;
    title: string;
  } | null;
}
