import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CalendarDays, Edit, GraduationCap, MapPin, Phone, User } from 'lucide-react';
import { Link } from 'react-router';
import { studentData } from './studentData';
import StudentProfileTabs from './components/student-profile-tabs';
import { Badge } from '@/components/ui/badge';

const StudentProfile = () => {
  const currentLanguage = 'en';
  const t = (x: string) => x;

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
      <div className='flex flex-1 flex-col gap-6 p-6'>
        {/* Hero Section */}
        <div className='border-primary/10 from-primary/10 via-background to-primary/5 relative overflow-hidden rounded-3xl border bg-linear-to-r p-8'>
          <div className='relative z-10 flex flex-col items-start gap-8 md:flex-row md:items-center'>
            <div className='relative'>
              <Avatar className='border-background h-32 w-32 rounded-3xl border-4 shadow-2xl'>
                <AvatarImage src={studentData.avatar?.url} alt={studentData.name} />
                <AvatarFallback className='bg-primary text-primary-foreground rounded-3xl text-3xl'>
                  {studentData.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className='flex-1 space-y-3'>
              <div className='flex flex-wrap items-center gap-3'>
                <h1 className='text-foreground text-4xl font-bold tracking-tight'>{studentData.name}</h1>
                {/* <Badge variant='outline' className='rounded-none border-green-500 bg-green-500/10 text-green-700'> */}
                {studentData.status.toLowerCase()}
                {/* </Badge> */}
              </div>

              <div className='text-muted-foreground flex flex-wrap gap-6 text-sm'>
                <div className='flex items-center gap-2'>
                  <CalendarDays className='text-primary h-4 w-4' />
                  <span>
                    {t('students:profile.joined')}
                    <span className='text-foreground ms-1 font-medium'>
                      {new Date(studentData.inscriptionDate).toLocaleDateString(currentLanguage, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </span>
                </div>

                <div className='flex items-center gap-2'>
                  {studentData.classroom ? (
                    <>
                      <GraduationCap className='text-primary h-4 w-4' />
                      <span className='font-medium'>{studentData.classroom.title}</span>
                      <Badge
                        variant='outline'
                        className={cn(
                          'rounded-none border-transparent',
                          'classroomTypeMeta.get(studentData.classroom.type)!.className',
                        )}
                      >
                        studentData.classroom.type.toLowerCase()
                      </Badge>
                    </>
                  ) : (
                    <Badge variant={'destructive'} className='rounded-none font-medium'>
                      <div className='flex items-center gap-2'>
                        <GraduationCap className='h-4 w-4' />
                        students:profile.no_class
                      </div>
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className='flex gap-3'>
              <Button variant='outline' size='icon' asChild className='rounded-full'>
                <Link to={`/students/${studentData.id}/edit`}>
                  <Edit className='h-4 w-4' />
                </Link>
              </Button>
            </div>
          </div>

          {/* Decorative background elements */}
          <div className='bg-primary/5 absolute -top-12 -right-12 h-64 w-64 rounded-full blur-3xl' />
          <div className='bg-primary/10 absolute -bottom-12 -left-12 h-48 w-48 rounded-full blur-3xl' />
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
          {/* Quick Info Sidebar */}
          <div className='space-y-6 lg:col-span-4'>
            <Card className='outline-border overflow-hidden border-none shadow-sm outline-1 transition-all hover:shadow-md'>
              <CardContent className='p-6'>
                <h3 className='text-foreground decoration-primary/30 mb-6 font-semibold underline-offset-4'>
                  students:profile.quick_details
                </h3>
                <div className='space-y-5'>
                  <div className='flex flex-col gap-1'>
                    <span className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
                      students:profile.parent_guardian
                    </span>
                    <div className='flex items-center gap-2 text-sm font-semibold'>
                      <User className='text-primary/70 h-4 w-4' />
                      {studentData.parents[0]?.user.name || 'common:not_provided'}
                    </div>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <span className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
                      students:profile.emergency_phone
                    </span>
                    <div className='flex items-center gap-2 text-sm font-semibold'>
                      <Phone className='text-primary/70 h-4 w-4' />
                      {studentData.parents[0]?.phone || 'common:not_provided'}
                    </div>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <span className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
                      students:profile.home_address
                    </span>
                    <div className='flex items-center gap-2 text-sm leading-relaxed'>
                      <MapPin className='text-primary/70 mt-0.5 h-4 w-4 shrink-0' />
                      <span className='font-medium'>{studentData.parents[0]?.address || 'common:not_provided'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-primary/5 border-none shadow-none'>
              <CardContent className='p-6 py-8'>
                <div className='flex h-full flex-col justify-between space-y-4 text-center'>
                  <div className='bg-background mx-auto rounded-2xl p-4 shadow-sm'>
                    <GraduationCap className='text-primary h-10 w-10' />
                  </div>
                  <div className='space-y-1'>
                    <h4 className='text-foreground font-bold'>{t('students:profile.academic_results.title')}</h4>
                    <p className='text-muted-foreground text-center text-sm'>
                      {t('students:profile.academic_results.description')}
                    </p>
                  </div>
                  <Button variant='link' className='text-primary font-semibold hover:no-underline'>
                    {t('students:profile.academic_results.view_full_report')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Areas */}
          <div className='lg:col-span-8'>
            <StudentProfileTabs student={studentData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentProfile;
