import firebaseService from '@/api/service/firebaseService';
import { useAuthStore } from '@/store/useAuthStore';
import { singUpSchema, type SignUpRequestSchema } from '@/types/auth/SignUpRequestDto';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

const useSignUpForm = () => {
  const form = useForm<SignUpRequestSchema>({
    resolver: zodResolver(singUpSchema),
  });
  const signUp = useAuthStore((state) => state.register);

  const navigate = useNavigate();
  const onSubmit = async (data: SignUpRequestSchema) => {
    try {
      // const response = await register(data);
      const firebaseResponse = await firebaseService.createUserWithEmailAndPassword(data.email, data.password);

      if (firebaseResponse.success === false) {
        form.setError(...firebaseResponse.error);
        throw new Error('Failed to create user with firebase');
      }

      const idToken = firebaseResponse.data;

      await signUp({ token: idToken });

      // !
      // if (signUpResponse.success === false) throw new Error('Failed to create user with backend');

      navigate('/on-boarding/profile');
    } catch (error) {
      console.log(error);
    }
  };
  return {
    form,
    onSubmit,
  };
};

export default useSignUpForm;
