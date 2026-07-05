import { studentService } from '@/api/service/studentService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { useQuery } from '@tanstack/react-query';
import { GraduationCap, ShieldAlert, User } from 'lucide-react';
import { useParams } from 'react-router';

const StudentOverview = () => {
  const { studentId } = useParams();
  const schoolId = useCurrentSchoolId();

  // Primary TanStack Query
  const { data } = useQuery({
    queryKey: ['students', studentId, 'full-details'],
    queryFn: () => studentService.findFullDetails(schoolId, studentId),
    enabled: !!studentId,
  });
  const student = data?.data ?? null;

  // Formatting date helper
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not Provided';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
      {/* Student Basic Card */}
      <Card className='rounded-2xl border-slate-100 shadow-xs lg:col-span-2 dark:border-zinc-800'>
        <CardHeader className='pb-4'>
          <CardTitle className='flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100'>
            <User className='text-primary h-5 w-5' />
            Basic Information
          </CardTitle>
          <CardDescription>Core personal identity details for the student</CardDescription>
        </CardHeader>
        <CardContent className='grid grid-cols-1 gap-x-6 gap-y-4 text-sm md:grid-cols-2'>
          <div className='space-y-1 rounded-lg bg-slate-50/50 p-3 dark:bg-zinc-900/30'>
            <span className='text-xs font-semibold tracking-wider text-slate-400 uppercase'>First Name</span>
            <p className='font-semibold text-slate-700 dark:text-slate-200'>{student.firstName.en}</p>
          </div>
          <div className='space-y-1 rounded-lg bg-slate-50/50 p-3 dark:bg-zinc-900/30'>
            <span className='text-xs font-semibold tracking-wider text-slate-400 uppercase'>Last Name</span>
            <p className='font-semibold text-slate-700 dark:text-slate-200'>{student.lastName.en}</p>
          </div>
          <div className='space-y-1 rounded-lg bg-slate-50/50 p-3 dark:bg-zinc-900/30'>
            <span className='text-xs font-semibold tracking-wider text-slate-400 uppercase'>Gender</span>
            <p className='font-semibold text-slate-700 capitalize dark:text-slate-200'>
              {student.gender.toLowerCase()}
            </p>
          </div>
          <div className='space-y-1 rounded-lg bg-slate-50/50 p-3 dark:bg-zinc-900/30'>
            <span className='text-xs font-semibold tracking-wider text-slate-400 uppercase'>Date of Birth</span>
            <p className='font-semibold text-slate-700 dark:text-slate-200'>{formatDate(student.dateOfBirth)}</p>
          </div>
          <div className='space-y-1 rounded-lg bg-slate-50/50 p-3 dark:bg-zinc-900/30'>
            <span className='text-xs font-semibold tracking-wider text-slate-400 uppercase'>UID / Register Number</span>
            <p className='font-semibold text-slate-700 dark:text-slate-200'>{student.uid || 'N/A'}</p>
          </div>
          <div className='space-y-1 rounded-lg bg-slate-50/50 p-3 dark:bg-zinc-900/30'>
            <span className='text-xs font-semibold tracking-wider text-slate-400 uppercase'>Last Profile Update</span>
            <p className='font-semibold text-slate-700 dark:text-slate-200'>{formatDate(student.updatedAt)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Classroom Info Card */}
      <Card className='flex flex-col rounded-2xl border-slate-100 shadow-xs dark:border-zinc-800'>
        <CardHeader className='pb-4'>
          <CardTitle className='flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100'>
            <GraduationCap className='text-primary h-5 w-5' />
            Academic Class
          </CardTitle>
          <CardDescription>Current classroom placement details</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-1 flex-col justify-between gap-6'>
          {student.classroom ? (
            <div className='space-y-4'>
              <div className='border-primary/10 bg-primary/5 rounded-xl border p-4'>
                <span className='text-primary text-xs font-bold tracking-wide uppercase'>Class Name</span>
                <h4 className='mt-0.5 text-lg font-bold text-slate-800 dark:text-slate-200'>
                  {student.classroom.name}
                </h4>
                <p className='mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400'>
                  {student.classroom.description || 'No class description available.'}
                </p>
              </div>

              <div className='grid grid-cols-2 gap-4 text-xs'>
                <div className='rounded-lg border p-3 dark:border-zinc-800'>
                  <span className='font-semibold text-slate-400 uppercase'>Grade Code</span>
                  <p className='mt-0.5 text-sm font-bold text-slate-700 dark:text-slate-300'>
                    {student.classroom.grade}
                  </p>
                </div>
                <div className='rounded-lg border p-3 dark:border-zinc-800'>
                  <span className='font-semibold text-slate-400 uppercase'>Class Assigned</span>
                  <p className='mt-0.5 text-sm font-bold text-slate-700 dark:text-slate-300'>
                    {formatDate(student.classroom.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center rounded-xl border border-dashed bg-slate-50/50 p-4 py-6 text-center dark:bg-zinc-900/30'>
              <ShieldAlert className='mb-2 h-10 w-10 text-amber-500' />
              <h4 className='font-bold text-slate-700 dark:text-slate-300'>No Class Assigned</h4>
              <p className='mt-1 max-w-50 text-xs text-slate-400'>
                Assign a classroom to allow course and progress tracking.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentOverview;
