import { Navigate, useParams } from 'react-router';
import z from 'zod';
import StudentProfileMain from './student-profile-main';

const StudentProfile = () => {
  const { studentId } = useParams();

  const validation = z.uuid().safeParse(studentId);

  if (!validation.success) {
    return <Navigate to='/not-found' replace />;
  }

  const validStudentId = validation.data;

  // if (isError)
  //   return (
  //     <>
  //       <Header fixed className='border-b'>
  //         <div className='ms-auto flex items-center space-x-4'>
  //           <ThemeSwitch />
  //           <LanguageSwitch triggerVariant='icon' />
  //           <ProfileDropdown />
  //         </div>
  //       </Header>
  //       <div className='flex-1 [&>div]:h-full'>
  //         <NotFoundError />
  //       </div>
  //     </>
  //   );

  // if (isPending || !studentData)
  //   return (
  //     <>
  //       <div className='flex-1 [&>div]:h-full'>
  //         <div className='flex items-center justify-center'>
  //           <Loader2 className='animate-spin' />
  //         </div>
  //       </div>
  //     </>
  //   );

  return (
    <>
      <StudentProfileMain studentId={validStudentId} />
    </>
  );
};

export default StudentProfile;
