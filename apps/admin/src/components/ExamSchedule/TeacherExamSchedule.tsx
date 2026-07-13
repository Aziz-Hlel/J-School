import { teacherService } from '@/api/service/teachersService';
import { Separator } from '@/components/ui/separator';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import BreadcrumbHeader from '@/pages/Header';
import { useGetCurrentProfile } from '@/store/useAuthStore';
import type { ExamScheduleWithClassroomRes } from '@repo/contracts/schemas/examSchedule/examScheduleWithClassroomResponse';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, CalendarDays, Clock, GraduationCap } from 'lucide-react';

// ── Domain colour map ──────────────────────────────────────────────────────
const domainConfig: Record<string, { label: string; color: string }> = {
  ARABIC_LANGUAGE: { label: 'Arabic', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' },
  SCIENCE_TECHNOLOGY: {
    label: 'Science & Tech',
    color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  },
  SOCIAL_EDUCATION: {
    label: 'Social Ed.',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
  ART_EDUCATION: { label: 'Art', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  PHYSICAL_EDUCATION: {
    label: 'Physical Ed.',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  },
  FRENCH_LANGUAGE: { label: 'French', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  ENGLISH_LANGUAGE: { label: 'English', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300' },
};

// ── ExamCard ────────────────────────────────────────────────────────────────
type ExamCardProps = {
  exam: ExamScheduleWithClassroomRes;
};

const ExamCard = ({ exam }: ExamCardProps) => {
  const domain = domainConfig[exam.subject.domain] ?? {
    label: exam.subject.domain,
    color: 'bg-muted text-muted-foreground',
  };

  const hasSchedule = exam.day || exam.startTime || exam.endTime;

  return (
    <div className='group bg-card relative flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'>
      {/* Coloured top accent strip */}
      <div className='h-1.5 w-full bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500' />

      <div className='flex flex-1 flex-col gap-4 p-5'>
        {/* ── Header: exam name + domain badge ── */}
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0'>
            <p className='text-foreground truncate text-base leading-tight font-bold'>{exam.name.en}</p>
            <p className='text-muted-foreground mt-0.5 truncate text-xs' dir='rtl'>
              {exam.name.ar}
            </p>
            <p className='text-muted-foreground truncate text-xs italic'>{exam.name.fr}</p>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${domain.color}`}>
            {domain.label}
          </span>
        </div>

        {/* ── Subject ── */}
        <div className='bg-muted/50 flex items-center gap-2 rounded-xl px-3 py-2.5'>
          <BookOpen className='h-3.5 w-3.5 shrink-0 text-indigo-500' />
          <div className='min-w-0'>
            <p className='text-foreground truncate text-xs font-semibold'>{exam.subject.name.en}</p>
            <div className='flex items-center gap-1.5'>
              <span className='text-muted-foreground truncate text-[10px] italic'>{exam.subject.name.fr}</span>
              <span className='text-muted-foreground/40 text-[10px]'>·</span>
              <span className='text-muted-foreground truncate text-[10px]' dir='rtl'>
                {exam.subject.name.ar}
              </span>
            </div>
          </div>
        </div>

        {/* ── Schedule ── */}
        {hasSchedule && (
          <div className='flex flex-wrap items-center gap-2'>
            {exam.day && (
              <div className='bg-background flex items-center gap-1.5 rounded-lg border px-2.5 py-1'>
                <CalendarDays className='h-3 w-3 text-indigo-500' />
                <span className='text-xs font-medium capitalize'>{exam.day.toLowerCase()}</span>
              </div>
            )}
            {(exam.startTime || exam.endTime) && (
              <div className='bg-background flex items-center gap-1.5 rounded-lg border px-2.5 py-1'>
                <Clock className='h-3 w-3 text-violet-500' />
                <span className='text-xs font-medium'>
                  {exam.startTime ?? '—'}
                  {exam.startTime && exam.endTime && <span className='text-muted-foreground'> → </span>}
                  {exam.endTime ?? ''}
                </span>
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* ── Classroom ── */}
        <div className='flex items-center gap-2.5'>
          <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40'>
            <GraduationCap className='h-4 w-4 text-indigo-600 dark:text-indigo-400' />
          </div>
          <div className='min-w-0'>
            <p className='truncate text-sm leading-tight font-semibold'>{exam.classroom.name}</p>
            <p className='text-muted-foreground truncate text-[10px] capitalize'>
              {exam.classroom.grade ? `Grade: ${exam.classroom.grade}` : 'No grade'}
              {exam.classroom.description ? ` · ${exam.classroom.description}` : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeacherExamScheduleOverview = () => {
  const schoolId = useCurrentSchoolId();
  const currentProfile = useGetCurrentProfile();

  const { data: examsScheduleData, isLoading: isExamsScheduleLoading } = useQuery({
    queryKey: ['teachers', currentProfile.id, 'exams'],
    queryFn: async () => teacherService.getExams(schoolId, currentProfile.id),
  });

  const examsSchedules = examsScheduleData?.data;

  return (
    <div className='bg-background min-h-screen'>
      <BreadcrumbHeader breadcrumbs={[{ title: 'Exam Schedule', href: '/exam-schedule' }]} />

      <div className='mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6'>
        {/* ── Top bar ── */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-foreground text-xl font-bold tracking-tight'>Exam Schedule</h1>
            <p className='text-muted-foreground mt-0.5 text-sm'>View your scheduled exams per classroom</p>
          </div>
        </div>

        {/* ── Exam Cards ── */}
        {isExamsScheduleLoading ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='bg-card animate-pulse rounded-2xl border p-5 shadow-sm'>
                <div className='bg-muted mb-3 h-4 w-2/3 rounded-md' />
                <div className='bg-muted mb-2 h-3 w-1/2 rounded-md' />
                <div className='bg-muted mb-4 h-3 w-3/4 rounded-md' />
                <Separator className='my-3' />
                <div className='flex items-center gap-3'>
                  <div className='bg-muted h-9 w-9 shrink-0 rounded-full' />
                  <div className='space-y-1.5'>
                    <div className='bg-muted h-3 w-24 rounded-md' />
                    <div className='bg-muted h-2.5 w-16 rounded-md' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !examsSchedules || examsSchedules.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center'>
            <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/40'>
              <CalendarDays className='h-8 w-8 text-amber-400' />
            </div>
            <p className='text-foreground text-base font-semibold'>No exams scheduled</p>
            <p className='text-muted-foreground mt-1 text-sm'>You have no scheduled exams at the moment.</p>
          </div>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {examsSchedules.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherExamScheduleOverview;
