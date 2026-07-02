import { useUser } from '@/context/UserContext';
import { Navigate, Outlet } from 'react-router';

const OnboardingSchoolCompleted = () => {
  const user = useUser();

  const ownerSchoolIncomplete = user.administration.find(
    (adminnistration) => adminnistration.school?.role === 'OWNER' && !adminnistration.school,
  );

  if (ownerSchoolIncomplete) {
    return <Navigate to='/onboarding-school' replace />;
  }

  return <Outlet />;
};

export default OnboardingSchoolCompleted;
