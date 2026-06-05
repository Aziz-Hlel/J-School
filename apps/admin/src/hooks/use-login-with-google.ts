import firebaseService from '@/api/service/firebaseService';
import { useAuthStore } from '@/store/useAuthStore';
import type { UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router';

const useLoginWithGoogle = (form: UseFormReturn<{ email: string; password: string; [key: string]: any }>) => {
  const oAuthSignIn = useAuthStore((state) => state.oAuthLogin);
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    const googleLoginResponse = await firebaseService.loginWithGoogle();

    if (googleLoginResponse.success === false) {
      form.setError(...googleLoginResponse.error);
      throw new Error('Failed to sign in with firebase');

      // throw new Error('Failed to sign in with Google: ' + JSON.stringify(googleLoginResponse.error, null, 2));
    }
    const idToken = googleLoginResponse.data;

    await oAuthSignIn({ token: idToken });

    navigate('/profile');
  };

  return { loginWithGoogle };
};

export default useLoginWithGoogle;
