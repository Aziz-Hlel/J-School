import ENV from '@/config/env.variables';

export const apiRoutes = {
  baseUrl: () => ENV.BASE_URL,

  health: () => '/health',

  media: {
    presignedUrl: () => '/media/presigned-url' as const,
  },

  auth: {
    signIn: () => '/auth/sign-in',
    signUp: () => '/auth/sign-up',
    oAuthSignIn: () => '/auth/provider',
    me: () => '/auth/me',
  },

  schools: {
    selectParent: (schoolId: string) => `/schools/${schoolId}/parents/select`,
  },

  staff: {
    create: (schoolId: string) => `/schools/${schoolId}/staff`,
    update: (schoolId: string, id: string) => `/schools/${schoolId}/staff/${id}`,
    getPage: (schoolId: string) => `/schools/${schoolId}/staff`,
    getById: (schoolId: string, id: string) => `/schools/${schoolId}/staff/${id}`,
    delete: (schoolId: string, id: string) => `/schools/${schoolId}/staff/${id}`,
  },

  student: {
    create: (schoolId: string) => `/schools/${schoolId}/students`,
    update: (schoolId: string, id: string) => `/schools/${schoolId}/students/${id}`,
    updateWithStatus: (schoolId: string, id: string) => `/schools/${schoolId}/students/${id}/with-status`,
    getPage: (schoolId: string) => `/schools/${schoolId}/students`,
    getById: (schoolId: string, id: string) => `/schools/${schoolId}/students/${id}`,
    findFullDetails: (schoolId: string, id: string) => `/schools/${schoolId}/students/${id}/full-details`,
    assignToClassroom: (schoolId: string, id: string) => `/schools/${schoolId}/students/${id}/classroom`,
    delete: (schoolId: string, id: string) => `/schools/${schoolId}/students/${id}`,
  },

  parentStudent: {
    unassignStudentFromParent: (studentId: string, parentId: string, schoolId: string) =>
      `/schools/${schoolId}/students/${studentId}/parents/${parentId}`,
    assignStudentToParent: (studentId: string, parentId: string, schoolId: string) =>
      `/schools/${schoolId}/students/${studentId}/parents/${parentId}`,
  },

  classrooms: {
    create: (schoolId: string) => `/schools/${schoolId}/classrooms`,
    update: (schoolId: string, id: string) => `/schools/${schoolId}/classrooms/${id}`,
    getPage: (schoolId: string) => `/schools/${schoolId}/classrooms`,
    getById: (schoolId: string, id: string) => `/schools/${schoolId}/classrooms/${id}`,
    delete: (schoolId: string, id: string) => `/schools/${schoolId}/classrooms/${id}`,
  },

  feed: {
    get: (schoolId: string) => `/schools/${schoolId}/feed`,
    create: (schoolId: string) => `/schools/${schoolId}/feed`,
    update: (schoolId: string, id: string) => `/schools/${schoolId}/feed/${id}`,
    delete: (schoolId: string, id: string) => `/schools/${schoolId}/feed/${id}`,
  },

  owner: {
    create: () => `/owners`,
  },
};
