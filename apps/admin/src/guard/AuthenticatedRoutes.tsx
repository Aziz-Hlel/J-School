import { useAuthStore } from '@/store/useAuthStore';
import LoadingSpinner from '@/utils/LoadingSpinner';
import { Navigate, Outlet } from 'react-router';

const AuthenticatedRoutes = () => {
  const status = useAuthStore((s) => s.status);
  console.log('status', status);
  if (status === 'idle') return <LoadingSpinner />;
  if (status === 'loading') return <LoadingSpinner />;

  if (status === 'unauthenticated') {
    console.log('Not logged in go home');
    return <Navigate to='/signin' />;
  }
  // return (
  //   <>
  //     {' '}
  //     <div className='pr-5'>Not logged in</div>{' '}
  //     <div className='underline hover:cursor-pointer' onClick={() => navigate('/signin')}>
  //       go Home
  //     </div>{' '}
  //   </>
  // );
  return <Outlet />;
};

export default AuthenticatedRoutes;
