import useSignInForm from './use-signIn-form';
import { LoginForm } from './sign-in-form';

const SignIn = () => {
  const { form, onSubmit } = useSignInForm();
  return (
    <div className='flex h-screen w-full items-center justify-center bg-gray-50'>
      <LoginForm form={form} onSubmit={onSubmit} />
    </div>
  );
};

export default SignIn;
