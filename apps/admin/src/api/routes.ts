import ENV from '@/config/env.variables';

export const apiRoutes = {
  baseUrl: () => ENV.BASE_URL,

  health: () => '/health',

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
};
