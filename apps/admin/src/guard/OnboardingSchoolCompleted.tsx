import { useUser } from '@/context/UserContext';
import { Navigate, Outlet } from 'react-router';

const OnboardingOwnerAndSchoolCompleted = () => {
  const user = useUser();

  if (user.account.role === 'ADMIN') {
    const ownerDetails = user.administration.find((adminnistration) => adminnistration.school?.role === 'OWNER');

    if (!ownerDetails) return <Navigate to='/onboarding-owner' replace />;

    if (!ownerDetails.school) return <Navigate to='/onboarding-school' replace />;
  }

  return <Outlet />;
};

export default OnboardingOwnerAndSchoolCompleted;
