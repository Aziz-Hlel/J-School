import { useUser } from '@/context/UserContext';
import React from 'react';
import { Navigate, Outlet } from 'react-router';

const OnboardingSchoolCompleted = () => {
  const user = useUser();

  // user.administration.find(adminnistration => adminnistration.school.)

  return <div>OnboardingSchoolCompleted</div>;
};

export default OnboardingSchoolCompleted;
