import { studentService } from '@/api/service/studentService';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import NotFound from '@/pages/NotFound';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Gender, StudentStatus } from '@repo/contracts/types/enums/enums';

import { Baby, Calendar, DollarSign, Edit, GraduationCap, HeartPulse, Info, Loader2, Users } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router';
import ChangeClassrooms from './components/change-classroom';
import EditStudent from './components/edit-student';

const StudentProfileMain = ({ studentId }: { studentId: string }) => {
  const schoolId = useCurrentSchoolId();

  // Primary TanStack Query
  const { data, isError, isPending } = useQuery({
    queryKey: ['students', studentId, 'full-details'],
    queryFn: () => studentService.findFullDetails(schoolId, studentId),
    enabled: !!studentId,
  });
  const student = data?.data ?? null;

  // Dialog management states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isClassroomOpen, setIsClassroomOpen] = useState(false);

  if (isError) {
    return (
      <div className='flex-1 p-6'>
        <NotFound />
      </div>
    );
  }

  if (isPending || !student) {
    return (
      <div className='flex min-h-100 flex-1 items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='text-primary h-8 w-8 animate-spin' />
          <p className='text-sm font-medium text-slate-500'>Loading student details...</p>
        </div>
      </div>
    );
  }

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

  // Styled status helpers
  const getStatusColor = (status: StudentStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'INACTIVE':
        return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'EXPELLED':
        return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  const getGenderColor = (gender: Gender) => {
    return gender === 'MALE'
      ? 'bg-sky-500/10 text-sky-600 border-sky-500/20'
      : 'bg-pink-500/10 text-pink-600 border-pink-500/20';
  };

  return (
    <div className='flex min-h-screen flex-1 flex-col gap-6 bg-slate-50/40 p-6 dark:bg-zinc-950/20'>
      {/* 1. Header Profile Hero Banner */}
      <div className='border-primary/10 from-primary/10 via-background to-primary/5 relative overflow-hidden rounded-3xl border bg-linear-to-r p-8 shadow-xs'>
        <div className='relative z-10 flex flex-col items-start gap-8 md:flex-row md:items-center'>
          <div className='group relative'>
            <Avatar className='border-background h-32 w-32 rounded-2xl border-4 shadow-lg transition-transform duration-300 group-hover:scale-105'>
              {student.avatar?.url ? (
                <AvatarImage src={student.avatar.url} alt={`${student.firstName.en} ${student.lastName.en}`} />
              ) : null}
              <AvatarFallback className='bg-primary text-primary-foreground rounded-2xl text-3xl font-bold'>
                {student?.firstName.en?.slice(0, 1).toUpperCase()}
                {student?.lastName.en?.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className='flex-1 space-y-3'>
            <div className='flex flex-wrap items-center gap-3'>
              <div>
                <h1 className='text-3xl font-extrabold tracking-tight text-slate-800 md:text-4xl dark:text-slate-100'>
                  {student.firstName.en} {student.lastName.en}
                </h1>
                <h1 className='text-3xl font-extrabold tracking-tight text-slate-800 md:text-4xl dark:text-slate-100'>
                  {student.firstName.ar} {student.lastName.ar}
                </h1>
              </div>
              <Badge
                variant='outline'
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${getStatusColor(student.status)}`}
              >
                {student.status.toLowerCase()}
              </Badge>
              <Badge
                variant='outline'
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${getGenderColor(student.gender)}`}
              >
                {student.gender.toLowerCase()}
              </Badge>
            </div>

            <div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400'>
              <div className='flex items-center gap-2'>
                <Calendar className='text-primary h-4 w-4' />
                <span>Joined {formatDate(student.createdAt)}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Info className='text-primary h-4 w-4' />
                <span>
                  ID:{' '}
                  <span className='font-semibold text-slate-700 dark:text-slate-300'>{student.uid || 'No UID'}</span>
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <GraduationCap className='text-primary h-4 w-4' />
                {student.classroom ? (
                  <Badge
                    variant='secondary'
                    className='bg-primary/10 text-primary hover:bg-primary/20 border-none font-medium'
                  >
                    {student.classroom.name} ({student.classroom.grade})
                  </Badge>
                ) : (
                  <Badge variant='destructive' className='font-medium'>
                    No Classroom
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className='flex flex-wrap justify-end gap-3 self-stretch md:self-auto'>
            <Button
              variant='outline'
              className='bg-background rounded-xl border-slate-200 shadow-xs dark:border-zinc-800'
              onClick={() => setIsEditOpen(true)}
            >
              <Edit className='mr-2 h-4 w-4 text-slate-500' />
              Edit Student
            </Button>
            <Button
              variant='secondary'
              className='bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl shadow-xs'
              onClick={() => setIsClassroomOpen(true)}
            >
              <GraduationCap className='mr-2 h-4 w-4' />
              Switch Classroom
            </Button>
          </div>
        </div>

        {/* Decorative Blur Spheres */}
        <div className='bg-primary/5 absolute -top-12 -right-12 h-64 w-64 rounded-full blur-3xl' />
        <div className='bg-primary/10 absolute -bottom-12 -left-12 h-48 w-48 rounded-full blur-3xl' />
      </div>

      {/* 2. Main Tabs Navigation Section */}
      <Tabs defaultValue='overview' className='w-full'>
        <div className='mb-6 flex items-center justify-between border-b border-slate-200 pb-2 dark:border-zinc-800'>
          <TabsList className='h-auto gap-6 bg-transparent p-0'>
            <Link to={`/students/${studentId}/profile`}>
              <TabsTrigger
                value='overview'
                className='data-[state=active]:border-primary data-[state=active]:text-primary rounded-none border-b-2 border-transparent bg-transparent px-1 pt-2 pb-3 text-sm font-semibold text-slate-500 shadow-none transition-all hover:text-slate-800 dark:hover:text-slate-200'
              >
                <Baby className='mr-2 h-4 w-4' />
                Overview
              </TabsTrigger>
            </Link>
            <Link to={`/students/${studentId}/profile/parents`}>
              <TabsTrigger
                value='parents'
                className='data-[state=active]:border-primary data-[state=active]:text-primary rounded-none border-b-2 border-transparent bg-transparent px-1 pt-2 pb-3 text-sm font-semibold text-slate-500 shadow-none transition-all hover:text-slate-800 dark:hover:text-slate-200'
              >
                <Users className='mr-2 h-4 w-4' />
                Parents ({student.parents.length})
              </TabsTrigger>
            </Link>
            <NavLink to={`/students/${studentId}/profile/health`}>
              <TabsTrigger
                value='health'
                className='data-[state=active]:border-primary data-[state=active]:text-primary rounded-none border-b-2 border-transparent bg-transparent px-1 pt-2 pb-3 text-sm font-semibold text-slate-500 shadow-none transition-all hover:text-slate-800 dark:hover:text-slate-200'
              >
                <HeartPulse className='mr-2 h-4 w-4' />
                Health Information
              </TabsTrigger>
            </NavLink>

            <NavLink to={`/students/${studentId}/profile/fees`}>
              <TabsTrigger
                value='fees'
                className='data-[state=active]:border-primary data-[state=active]:text-primary rounded-none border-b-2 border-transparent bg-transparent px-1 pt-2 pb-3 text-sm font-semibold text-slate-500 shadow-none transition-all hover:text-slate-800 dark:hover:text-slate-200'
              >
                <DollarSign className='mr-2 h-4 w-4' />
                Fees Information
              </TabsTrigger>
            </NavLink>
          </TabsList>
        </div>
        <Outlet />
      </Tabs>

      {isClassroomOpen && (
        <ChangeClassrooms
          currentClassroomId={student?.classroom?.id || null}
          setIsClassroomOpen={setIsClassroomOpen}
          studentId={studentId}
        />
      )}

      {isEditOpen && <EditStudent setIsEditOpen={setIsEditOpen} student={student} />}
    </div>
  );
};

export default StudentProfileMain;
