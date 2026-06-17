export const studentData = {
  id: 'student_abc123',
  name: 'Leo Dupont',
  gender: 'M', // Gender: 'M' | 'F'
  status: 'APPROVED', // Status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'DISABLED' | 'DELETED'
  birthDate: '2020-05-15T00:00:00.000Z',
  inscriptionDate: '2025-09-01T00:00:00.000Z',
  nationality: 'French',
  avatar: {
    id: 'media_avatar_01',
    key: 'avatars/leo_dupont.jpg',
    url: 'https://example.com/storage/avatars/leo_dupont.jpg',
    category: 'IMAGE', // 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'OTHER'
    purpose: 'AVATAR', // 'AVATAR' | 'IMAGE' | ...
    blurhash: 'L6PZf9ODyE_Gg2-p5bof00Rj%NDi',
    mimeType: 'image/jpeg',
    size: 204800,
    originalName: 'leo_face.jpg',
  },
  createdAt: '2025-08-15T10:30:00.000Z',
  updatedAt: '2026-06-17T16:12:00.000Z',
  healthInfo: {
    id: 'health_info_leo',
    vaccine: 'COMPLETE', // VaccineProgress: 'COMPLETE' | 'UNCOMPLETE'
    doctorName: 'Dr. Marie Martin',
    doctorPhone: '+33612345678',
    studentId: 'student_abc123',
    createdAt: '2025-08-15T10:30:00.000Z',
    updatedAt: '2026-06-17T16:12:00.000Z',
    medicalConditions: [
      {
        id: 'cond_allergy_01',
        healthInfoId: 'health_info_leo',
        type: 'ALLERGY', // MedicalConditionType: 'ALLERGY' | 'VISION' | ...
        details: 'Peanut allergy, requires EpiPen',
        createdAt: '2025-08-15T10:30:00.000Z',
        updatedAt: '2025-08-15T10:30:00.000Z',
      },
    ],
    emergencyContacts: [
      {
        id: 'contact_emergency_01',
        healthInfoId: 'health_info_leo',
        name: 'Grandmother Alice',
        phone: '+33698765432',
        createdAt: '2025-08-15T10:30:00.000Z',
        updatedAt: '2025-08-15T10:30:00.000Z',
      },
    ],
  },
  classroom: {
    id: 'classroom_daycare_01',
    title: 'Les Petits Chatons',
    type: 'DAYCARE', // ClassroomType: 'PRESCHOOL' | 'DAYCARE' | 'PRIMARY_SCHOOL'
  },
  studentDocuments: {
    media: [
      {
        id: 'media_doc_birth',
        key: 'documents/birth_certificate_leo.pdf',
        url: 'https://example.com/storage/documents/birth_certificate_leo.pdf',
        category: 'DOCUMENT',
        purpose: 'BIRTH_CERTIFICATE',
        blurhash: null,
        mimeType: 'application/pdf',
        size: 1048576,
        originalName: 'birth_certif.pdf',
      },
    ],
  },
  parents: [
    {
      id: 'parent_jean_01',
      phone: '+33611223344',
      gender: 'M',
      cin: 'AB123456',
      address: '123 Rue de la Paix, Paris',
      profession: 'Software Engineer',
      maritalStatus: 'MARRIED', // MaritalStatus: 'SINGLE' | 'MARRIED' | ...
      userId: 'user_jean_01',
      createdAt: '2025-08-15T10:20:00.000Z',
      updatedAt: '2026-06-17T16:12:00.000Z',
      user: {
        id: 'user_jean_01',
        email: 'jean.dupont@example.com',
        name: 'Jean Dupont',
        emailVerified: true,
        disabledAt: null,
        deletedAt: null,
        status: 'APPROVED',
        role: 'PARENT', // UserRole: 'ADMIN' | 'TEACHER' | 'PARENT'
      },
    },
  ],
  familyMembers: [
    {
      name: 'Sophie Dupont',
      phone: '+33655667788',
      description: 'Aunt who is authorized to pick up from daycare',
    },
  ],
};
