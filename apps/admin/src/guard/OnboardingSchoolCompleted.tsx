import { useUser } from '@/context/UserContext';
import { Navigate, Outlet } from 'react-router';

const OnboardingOwnerAndSchoolCompleted = () => {
  const user = useUser();

  if (user.account.role === 'ADMIN') {
    const ownerDetails = user.administration.find((adminnistration) => adminnistration.role === 'OWNER');
    console.log('ownerdetails , ', ownerDetails);

    if (!ownerDetails) return <Navigate to='/on-boarding/profile' replace />;

    if (!ownerDetails.school) return <Navigate to='/on-boarding/school' replace />;
  }

  return <Outlet />;
};

export default OnboardingOwnerAndSchoolCompleted;
