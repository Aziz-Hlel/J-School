import { authService } from '@/api/service/authService';
import { jwtTokenManager } from '@/api/token/JwtTokenManager.class';
import ENV from '@/config/env.variables';
import type { FirebaseSignInRequestDto } from '@/types/auth/SignInRequestDto';
import type { FirebaseSignUpRequestSchema } from '@/types/auth/SignUpRequestDto';
import type {
  AdministrationWorkspace,
  AuthResponse,
  TeacherWorkspace,
} from '@repo/contracts/schemas/auth/authResponse';
import type { UserProfileResponse } from '@repo/contracts/schemas/profile/UserProfileResponse';
import { UserRole } from '@repo/contracts/types/enums/enums';
import { create } from 'zustand';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

type AuthStore = {
  status: AuthStatus;
  currentUser: null | UserProfileResponse;
  currentProfile: AdministrationWorkspace | TeacherWorkspace | null;
  currentRole: UserRole | null;
  schoolId: string | null;
  bootstrap: () => Promise<void>;
  assignCurrentProfile: (user: AuthResponse) => void;

  login: (payload: FirebaseSignInRequestDto) => Promise<void>;
  register: (payload: FirebaseSignInRequestDto) => Promise<void>;
  oAuthLogin: (payload: FirebaseSignInRequestDto) => Promise<void>;
  logout: () => void;
};

const fetchCurrentUser = async (): Promise<UserProfileResponse | null> => {
  try {
    const response = await authService.me();
    return response.success ? response.data.data : null;
  } catch (error) {
    console.log('something went wrong while fetching current user', error);
    return null;
  }
};

const loginFunc = async (payload: FirebaseSignInRequestDto) => {
  try {
    const response = await authService.signIn(payload);
    return response.success ? response.data.data : null;
  } catch (error) {
    console.log('something went wrong while logging in', error);
    return null;
  }
};

const signupFunc = async (payload: FirebaseSignUpRequestSchema) => {
  try {
    const response = await authService.signUp(payload);
    return response.success ? response.data.data : null;
  } catch (error) {
    console.log('something went wrong while signing up', error);
    return null;
  }
};

const oAuthLoginFunc = async (payload: FirebaseSignInRequestDto) => {
  try {
    const response = await authService.oAuthSignIn(payload);
    return response.success ? response.data.data : null;
  } catch (error) {
    console.log('something went wrong while logging in with oAuth', error);
    return null;
  }
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  status: 'idle',
  currentUser: null,
  currentRole: UserRole.DIRECTOR,
  schoolId: null,
  currentProfile: null,

  // Helper
  assignCurrentProfile: (user: AuthResponse) => {
    const administration = user.administration[0];
    const teacher = user.teacher[0];
    if (administration && administration.school?.id) {
      const role = administration.role === 'OWNER' ? 'DIRECTOR' : administration.role; // !
      if (ENV.VITE_NODE_ENV !== 'production') console.log('// ! got role as owner but changed it to DIRECTOR');
      set({
        status: 'authenticated',
        currentUser: user,
        currentProfile: administration,
        schoolId: administration.school.id,
        currentRole: role,
      });
    } else if (teacher) {
      set({ status: 'authenticated', currentUser: user, currentProfile: teacher, schoolId: teacher.school.id });
    }
  },

  //

  bootstrap: async () => {
    set({ status: 'loading' });

    const token = await jwtTokenManager.getAccessToken();

    if (!token) {
      set({ status: 'unauthenticated' });
      return;
    }

    const user = await fetchCurrentUser();
    if (!user) {
      set({ status: 'unauthenticated' });
      return;
    }
    get().assignCurrentProfile(user);
  },

  register: async (payload: FirebaseSignInRequestDto) => {
    set({ status: 'loading' });

    const signUpResponse = await signupFunc(payload);

    if (!signUpResponse) {
      set({ status: 'unauthenticated' });
      return;
    }

    const user = await fetchCurrentUser();

    set({ currentUser: user });
    await jwtTokenManager.refreshAccessToken();
    set({ status: 'authenticated' });
  },

  login: async (payload: FirebaseSignInRequestDto) => {
    set({ status: 'loading' });

    const signInResponse = await loginFunc(payload);

    if (!signInResponse) {
      set({ status: 'unauthenticated' });
      return;
    }

    const user = await fetchCurrentUser();

    if (user) {
      get().assignCurrentProfile(user);
    }

    await jwtTokenManager.refreshAccessToken();
    // ! change this director thing based on the last user profile role stored in localstorage
  },

  oAuthLogin: async (payload: FirebaseSignInRequestDto) => {
    set({ status: 'loading' });

    const signInResponse = await oAuthLoginFunc(payload);

    if (!signInResponse) {
      set({ status: 'unauthenticated' });
      return;
    }

    const user = await fetchCurrentUser();

    if (user) {
      get().assignCurrentProfile(user);
    }
    await jwtTokenManager.refreshAccessToken();
  },

  logout: () => {
    jwtTokenManager.clearTokens();
    set({ status: 'unauthenticated' });
  },

  setCurrentRole: (role: UserRole) => {
    set({ currentRole: role });
  },
}));

export const useGetCurrentProfile = () => useAuthStore((state) => state.currentProfile);

export const useGetUserCurrentRole = () => useAuthStore((state) => state.currentRole);
