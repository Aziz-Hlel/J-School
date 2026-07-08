import { Navigate, Outlet, useParams } from 'react-router';
import { z } from 'zod';
import ExtraCurricularHeader from './extra-curricular-header';

const ExtracurricularOverview = () => {
  const { extraCurricularId } = useParams();

  const validation = z.uuid().safeParse(extraCurricularId);

  if (!validation.success) {
    return <Navigate to='/not-found' replace />;
  }

  return (
    <div className='p-8'>
      <ExtraCurricularHeader />
      <Outlet />
    </div>
  );
};

export default ExtracurricularOverview;
