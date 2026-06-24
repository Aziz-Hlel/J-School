import { studentService } from '@/api/service/studentService';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import NotFound from '@/pages/NotFound';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ParentResponse } from '@repo/contracts/schemas/parent/parentResponse';
import type { Gender, StudentStatus, VaccineStatus } from '@repo/contracts/types/enums/enums';

import {
  Award,
  Baby,
  Calendar,
  Edit,
  GraduationCap,
  HeartPulse,
  Info,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  ShieldAlert,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import AssignParent from './components/assign-parent';
import ChangeClassrooms from './components/change-classroom';
import EditStudent from './components/edit-student';
import UnassignParentDialog from './components/unassign-parent-dialog';

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
  const [isAssignParentOpen, setIsAssignParentOpen] = useState(false);
  const [isUnassignParentOpen, setIsUnassignParentOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<ParentResponse | null>(null);

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

  const getVaccineColor = (vaccine: VaccineStatus) => {
    switch (vaccine) {
      case 'FULLY_VACCINATED':
        return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
      case 'PARTIALLY_VACCINATED':
        return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      case 'NOT_VACCINATED':
        return 'bg-rose-500/10 text-rose-600 border border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 border border-slate-500/20';
    }
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
            <TabsTrigger
              value='overview'
              className='data-[state=active]:border-primary data-[state=active]:text-primary rounded-none border-b-2 border-transparent bg-transparent px-1 pt-2 pb-3 text-sm font-semibold text-slate-500 shadow-none transition-all hover:text-slate-800 dark:hover:text-slate-200'
            >
              <Baby className='mr-2 h-4 w-4' />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value='parents'
              className='data-[state=active]:border-primary data-[state=active]:text-primary rounded-none border-b-2 border-transparent bg-transparent px-1 pt-2 pb-3 text-sm font-semibold text-slate-500 shadow-none transition-all hover:text-slate-800 dark:hover:text-slate-200'
            >
              <Users className='mr-2 h-4 w-4' />
              Parents ({student.parents.length})
            </TabsTrigger>
            <TabsTrigger
              value='health'
              className='data-[state=active]:border-primary data-[state=active]:text-primary rounded-none border-b-2 border-transparent bg-transparent px-1 pt-2 pb-3 text-sm font-semibold text-slate-500 shadow-none transition-all hover:text-slate-800 dark:hover:text-slate-200'
            >
              <HeartPulse className='mr-2 h-4 w-4' />
              Health Information
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: OVERVIEW */}
        <TabsContent value='overview' className='space-y-6 outline-hidden'>
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
                  <span className='text-xs font-semibold tracking-wider text-slate-400 uppercase'>
                    UID / Register Number
                  </span>
                  <p className='font-semibold text-slate-700 dark:text-slate-200'>{student.uid || 'N/A'}</p>
                </div>
                <div className='space-y-1 rounded-lg bg-slate-50/50 p-3 dark:bg-zinc-900/30'>
                  <span className='text-xs font-semibold tracking-wider text-slate-400 uppercase'>
                    Last Profile Update
                  </span>
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
        </TabsContent>

        {/* TAB 2: PARENTS */}
        <TabsContent value='parents' className='space-y-6 outline-hidden'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <h2 className='text-xl font-bold text-slate-800 dark:text-slate-100'>Parents & Guardians</h2>
              <p className='text-sm text-slate-500'>
                Assigned representatives authorized for pick-ups and school communications
              </p>
            </div>
            <Button
              size='sm'
              className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-xs'
              onClick={() => setIsAssignParentOpen(true)}
            >
              <Plus className='mr-1.5 h-4 w-4' />
              Assign Parent
            </Button>
          </div>

          {student.parents.length === 0 ? (
            <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white p-12 text-center shadow-xs dark:bg-zinc-900/10'>
              <Users className='mb-3 h-12 w-12 text-slate-300' />
              <h3 className='text-lg font-bold text-slate-700 dark:text-slate-300'>No Parents Assigned</h3>
              <p className='mt-1 mb-6 max-w-sm text-sm text-slate-400'>
                This student profile currently does not have any linked parent or guardian details.
              </p>
              <Button size='sm' className='bg-primary rounded-xl' onClick={() => setIsAssignParentOpen(true)}>
                Link Parent Record Now
              </Button>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {student.parents.map((parent) => (
                <Card
                  key={parent.id}
                  className='relative flex flex-col justify-between overflow-hidden rounded-2xl border-slate-100 transition-all duration-200 hover:shadow-md dark:border-zinc-800'
                >
                  <CardContent className='flex flex-1 flex-col justify-between gap-6 p-6'>
                    <div className='space-y-4'>
                      <div className='flex items-start gap-4'>
                        <Avatar className='border-background h-16 w-16 shrink-0 rounded-xl border-2 shadow-xs'>
                          {parent.avatar?.url ? (
                            <AvatarImage src={parent.avatar.url} alt={`${parent.firstName} ${parent.lastName}`} />
                          ) : null}
                          <AvatarFallback className='bg-primary/10 text-primary rounded-xl text-lg font-bold'>
                            {parent.firstName.slice(0, 1).toUpperCase()}
                            {parent.lastName.slice(0, 1).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className='min-w-0'>
                          <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                            <h3 className='truncate text-lg leading-tight font-bold text-slate-800 dark:text-slate-200'>
                              {parent.firstName} {parent.lastName}
                            </h3>
                            <Badge
                              variant='secondary'
                              className='rounded-full px-2 py-0.5 text-[10px] font-medium capitalize'
                            >
                              {parent.gender.toLowerCase()}
                            </Badge>
                          </div>
                          <p className='mt-0.5 font-mono text-[10px] text-slate-400'>ID: {parent.id}</p>
                        </div>
                      </div>

                      <Separator className='bg-slate-100 dark:bg-zinc-800' />

                      <div className='space-y-2 text-sm text-slate-600 dark:text-slate-400'>
                        <div className='flex items-center gap-3'>
                          <Mail className='h-4 w-4 shrink-0 text-slate-400' />
                          <span className='truncate'>{parent.email || 'No email provided'}</span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <Phone className='h-4 w-4 shrink-0 text-slate-400' />
                          <span>{parent.phone || 'No phone number'}</span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <MapPin className='h-4 w-4 shrink-0 text-slate-400' />
                          <span className='truncate'>{parent.address || 'No address provided'}</span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <Award className='h-4 w-4 shrink-0 text-slate-400' />
                          <span>
                            CIN / Identity Card:{' '}
                            <span className='font-semibold text-slate-700 dark:text-slate-300'>
                              {parent.cin || 'Not provided'}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => {
                        setIsUnassignParentOpen(true);
                        setSelectedParent(parent);
                      }}
                      className='mt-4 w-full rounded-xl border-rose-200 bg-rose-50 font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400'
                    >
                      <Trash2 className='mr-2 h-4 w-4' />
                      Unassign Parent Link
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 3: HEALTH INFORMATION */}
        <TabsContent value='health' className='space-y-6 outline-hidden'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* Health profile card */}
            <Card className='rounded-2xl border-slate-100 shadow-xs lg:col-span-2 dark:border-zinc-800'>
              <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100'>
                  <HeartPulse className='text-primary h-5 w-5' />
                  Health & Vaccine Profile
                </CardTitle>
                <CardDescription>Allergies, vaccination history, and custom health records</CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                {student.profile ? (
                  <>
                    {/* Vaccine details */}
                    <div className='flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 md:flex-row md:items-center dark:border-zinc-800 dark:bg-zinc-900/30'>
                      <div className='space-y-1'>
                        <h4 className='font-bold text-slate-700 dark:text-slate-300'>Vaccination Status</h4>
                        <p className='text-xs text-slate-400'>Required immunizations file validation status</p>
                      </div>
                      <Badge
                        variant='outline'
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${getVaccineColor(student.profile.vaccine)}`}
                      >
                        {student.profile.vaccine.replace('_', ' ').toLowerCase()}
                      </Badge>
                    </div>

                    {/* Allergies block */}
                    <div className='space-y-2'>
                      <h4 className='flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300'>
                        <ShieldAlert className='h-4 w-4 text-rose-500' />
                        Allergies & Sensitivities
                      </h4>
                      <div className='rounded-xl border border-rose-100 bg-rose-50/30 p-4 dark:border-rose-950/30 dark:bg-rose-950/10'>
                        <p className='text-sm leading-relaxed font-medium text-slate-700 dark:text-slate-300'>
                          {student.profile.allergies || 'No allergies recorded.'}
                        </p>
                      </div>
                    </div>

                    {/* Health info notes */}
                    <div className='space-y-2'>
                      <h4 className='font-bold text-slate-700 dark:text-slate-300'>Health Conditions & Medical Info</h4>
                      <div className='rounded-xl border border-slate-100 bg-slate-50/30 p-4 dark:border-zinc-800 dark:bg-zinc-900/30'>
                        <p className='text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
                          {student.profile.healthInfo || 'No major health conditions recorded.'}
                        </p>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div className='space-y-2'>
                      <h4 className='font-bold text-slate-700 dark:text-slate-300'>Additional Medical Notes</h4>
                      <div className='rounded-xl border border-slate-100 bg-slate-50/30 p-4 dark:border-zinc-800 dark:bg-zinc-900/30'>
                        <p className='text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
                          {student.profile.notes || 'No extra notes.'}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className='flex flex-col items-center justify-center rounded-xl border border-dashed bg-slate-50/50 p-4 py-10 text-center dark:bg-zinc-900/30'>
                    <ShieldAlert className='mb-2 h-12 w-12 text-slate-300' />
                    <h4 className='font-bold text-slate-700 dark:text-slate-300'>No Health Record File</h4>
                    <p className='mt-1 max-w-60 text-xs text-slate-400'>
                      Create a student profile to track health information, vaccine progress and emergencies.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Emergency contacts card */}
            <Card className='rounded-2xl border-slate-100 shadow-xs dark:border-zinc-800'>
              <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100'>
                  <Phone className='h-5 w-5 text-rose-500' />
                  Emergency Contacts
                </CardTitle>
                <CardDescription>Immediate contacts in case of alert or distress</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {student.profile?.emergencyContacts && student.profile.emergencyContacts.length > 0 ? (
                  student.profile.emergencyContacts.map((contact, idx) => (
                    <div
                      key={idx}
                      className='group relative rounded-xl border border-slate-100 bg-slate-50/30 p-4 transition-all hover:border-slate-200 dark:border-zinc-800 dark:bg-zinc-900/20'
                    >
                      <span className='absolute top-3 right-3 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-500 capitalize dark:bg-rose-950/20'>
                        {contact.relation.toLowerCase()}
                      </span>
                      <h4 className='text-base font-bold text-slate-800 dark:text-slate-200'>{contact.name}</h4>
                      <div className='mt-2 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400'>
                        <Phone className='h-4 w-4 text-slate-400' />
                        <span>{contact.phone}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='flex flex-col items-center justify-center rounded-xl border border-dashed bg-slate-50/50 p-4 py-6 text-center dark:bg-zinc-900/30'>
                    <Phone className='mb-2 h-8 w-8 text-slate-300' />
                    <h4 className='font-bold text-slate-700 dark:text-slate-300'>No Emergency Contacts</h4>
                    <p className='mt-1 max-w-45 text-xs text-slate-400'>Add immediate contact details for alerts.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {isClassroomOpen && (
        <ChangeClassrooms
          currentClassroomId={student?.classroom?.id || null}
          setIsClassroomOpen={setIsClassroomOpen}
          studentId={studentId}
        />
      )}

      {isAssignParentOpen && <AssignParent studentId={studentId} setIsAssignParentOpen={setIsAssignParentOpen} />}

      {isUnassignParentOpen && (
        <UnassignParentDialog
          studentId={studentId}
          parentId={selectedParent?.id || ''}
          handleCancel={() => setIsUnassignParentOpen(false)}
        />
      )}

      {isEditOpen && <EditStudent setIsEditOpen={setIsEditOpen} student={student} />}
    </div>
  );
};

export default StudentProfileMain;
