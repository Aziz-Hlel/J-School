import { Outlet } from 'react-router';
import TeacherExtraCurricularHeader from './teacher-extra-curricular-header';

const TeacherExtraCurricularDisplay = () => {
  return (
    <div className='p-8'>
      <TeacherExtraCurricularHeader />
      <Outlet />
    </div>
  );
};

export default TeacherExtraCurricularDisplay;
