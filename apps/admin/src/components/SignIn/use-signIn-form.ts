import firebaseService from '@/api/service/firebaseService';
import { useAuthStore } from '@/store/useAuthStore';
import { type SignInRequestDto, singInSchema } from '@/types/auth/SignInRequestDto';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

const useSignInForm = () => {
  const form = useForm<SignInRequestDto>({
    resolver: zodResolver(singInSchema),
  });

  const signIn = useAuthStore((state) => state.login);

  const navigate = useNavigate();

  const onSubmit = async (data: SignInRequestDto) => {
    try {
      const firebaseResponse = await firebaseService.signInWithEmailAndPassword(data.email, data.password);

      if (firebaseResponse.success === false) {
        form.setError(...firebaseResponse.error);
        throw new Error('Failed to sign in with firebase');
      }

      const idToken = firebaseResponse.data;

      await signIn({
        token: idToken,
      });

      // if (response.success === false) {
      //   if (response.status === 500) {
      //     form.setError('root', { message: 'Server error. Please try again later.' });
      //   }
      //   throw new Error('Failed to sign in with backend');
      // }

      navigate('/profile');
    } catch (error) {
      console.log(error);
    }
  };

  return {
    form,
    onSubmit,
  };
};

export default useSignInForm;
