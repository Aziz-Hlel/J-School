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
    getPage: (schoolId: string) => `/schools/${schoolId}/students`,
    getById: (schoolId: string, id: string) => `/schools/${schoolId}/students/${id}`,
    delete: (schoolId: string, id: string) => `/schools/${schoolId}/students/${id}`,
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
  },
};
