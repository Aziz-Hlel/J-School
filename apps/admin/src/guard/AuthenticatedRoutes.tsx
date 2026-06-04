import { useAuthStore } from '@/store/useAuthStore';
import LoadingSpinner from '@/utils/LoadingSpinner';
import { Outlet, useNavigate } from 'react-router';

const AuthenticatedRoutes = () => {
  const status = useAuthStore((s) => s.status);

  const navigate = useNavigate();

  if (status === 'idle') return <LoadingSpinner />;
  if (status === 'loading') return <LoadingSpinner />;
  if (status === 'unauthenticated')
    return (
      <>
        {' '}
        <div className='pr-5'>Not logged in</div>{' '}
        <div className='underline hover:cursor-pointer' onClick={() => navigate('/signin')}>
          go Home
        </div>{' '}
      </>
    );

  return <Outlet />;
};

export default AuthenticatedRoutes;
