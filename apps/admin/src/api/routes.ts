import ENV from '@/config/env.variables';

export const apiRoutes = {
  baseUrl: () => ENV.BASE_URL,

  health: () => '/health',

  auth: {
    signIn: () => '/auth/sign-in',
    signUp: () => '/auth/sign-up',
    oAuthSignIn: () => '/auth/o-auth/sign-in',
    me: () => '/auth/me',
  },
};
