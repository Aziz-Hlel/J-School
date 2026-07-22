import { classroomsService } from '@/api/service/classroomsService';
import schoolService from '@/api/service/schoolService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import BreadcrumbHeader from '@/pages/Header';
import type { ClassroomExamScheduleResponse } from '@repo/contracts/schemas/classroom/management/ClassroomExamSchedulesResponse';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, CalendarDays, Clock, Pencil, Plus, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddScheduleExam from './add-scheduleExam';
import DeleteScheduleExam from './delete-scheduleExam';
import EditExamSchedule from './edit-scheduleExam';

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
  exam: ClassroomExamScheduleResponse;
  onEdit: () => void;
  onDelete: () => void;
};

const ExamCard = ({ exam, onEdit, onDelete }: ExamCardProps) => {
  const domain = domainConfig[exam.subject.domain] ?? {
    label: exam.subject.domain,
    color: 'bg-muted text-muted-foreground',
  };

  const teacherInitials = exam.teacher
    ? `${exam.teacher.firstName[0] ?? ''}${exam.teacher.lastName[0] ?? ''}`.toUpperCase()
    : null;

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

        {/* ── Teacher ── */}
        {exam.teacher ? (
          <div className='flex items-center justify-between gap-3'>
            <div className='flex items-center gap-2.5'>
              <Avatar className='h-9 w-9 ring-2 ring-indigo-100 dark:ring-indigo-900/50'>
                {exam.teacher.avatar?.url && (
                  <AvatarImage
                    src={exam.teacher.avatar.url}
                    alt={`${exam.teacher.firstName} ${exam.teacher.lastName}`}
                  />
                )}
                <AvatarFallback className='bg-linear-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white'>
                  {teacherInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='text-sm leading-tight font-semibold'>
                  {exam.teacher.firstName} {exam.teacher.lastName}
                </p>
                <p className='text-muted-foreground text-[10px] capitalize'>
                  {exam.teacher.gender === 'MALE' ? 'Mr.' : 'Ms.'} · Teacher
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className='flex items-center gap-1'>
              <button
                onClick={onEdit}
                className='text-muted-foreground flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40'
                aria-label='Edit exam'
              >
                <Pencil className='h-3.5 w-3.5' />
              </button>
              <button
                onClick={onDelete}
                className='text-muted-foreground flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40'
                aria-label='Delete exam'
              >
                <Trash2 className='h-3.5 w-3.5' />
              </button>
            </div>
          </div>
        ) : (
          <div className='flex items-center justify-between gap-3'>
            <div className='text-muted-foreground flex items-center gap-2'>
              <div className='flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed'>
                <User className='h-4 w-4' />
              </div>
              <span className='text-xs italic'>No teacher assigned</span>
            </div>

            {/* Actions */}
            <div className='flex items-center gap-1'>
              <button
                onClick={onEdit}
                className='text-muted-foreground flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40'
                aria-label='Edit exam'
              >
                <Pencil className='h-3.5 w-3.5' />
              </button>
              <button
                onClick={onDelete}
                className='text-muted-foreground flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40'
                aria-label='Delete exam'
              >
                <Trash2 className='h-3.5 w-3.5' />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminExamScheduleOverview = () => {
  const { t } = useTranslation(['exam']);
  const schoolId = useCurrentSchoolId();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [classroomId, setClassroomId] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<ClassroomExamScheduleResponse | null>(null);

  const { data: classroomsData } = useQuery({
    queryKey: ['classrooms', 'select'],
    queryFn: () => schoolService.selectClassrooms({ schoolId }),
  });
  const classrooms = classroomsData?.data ?? [];

  const { data: examsScheduleData, isLoading: isExamsScheduleLoading } = useQuery({
    queryKey: ['classrooms', classroomId, 'exams'],
    queryFn: async () => (classroomId ? await classroomsService.exams.get({ schoolId, classroomId }) : undefined),
    enabled: Boolean(classroomId),
  });

  const examsSchedules = examsScheduleData?.data;

  const handleDeleteClick = (exam: ClassroomExamScheduleResponse) => {
    setSelectedExam(exam);
    setIsDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
    setSelectedExam(null);
  };

  const handleEditClick = (exam: ClassroomExamScheduleResponse) => {
    setSelectedExam(exam);
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
    setSelectedExam(null);
  };

  return (
    <div className='bg-background min-h-screen'>
      <BreadcrumbHeader breadcrumbs={[{ title: t('exam:title'), href: '/exam-schedule' }]} />
      <div className='mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6'>
        {/* ── Top bar ── */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-foreground text-xl font-bold tracking-tight'>{t('exam:header.title')}</h1>
            <p className='text-muted-foreground mt-0.5 text-sm'>{t('exam:header.subtitle')}</p>
          </div>

          {classroomId && (
            <Button
              onClick={() => setIsAddOpen(true)}
              className='gap-2 rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
            >
              <Plus className='h-4 w-4' />
              {t('exam:header.add_exam')}
            </Button>
          )}
        </div>

        {/* ── Classroom selector card ── */}
        <Card className='overflow-hidden border shadow-sm'>
          <div className='bg-muted/30 border-b px-5 py-4'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center gap-2.5'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/40'>
                  <CalendarDays className='h-4 w-4 text-indigo-600 dark:text-indigo-400' />
                </div>
                <div>
                  <p className='text-sm font-semibold'>{t('exam:classroom_selector.title')}</p>
                  <p className='text-muted-foreground text-xs'>{t('exam:classroom_selector.subtitle')}</p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                {examsSchedules && (
                  <Badge variant='secondary' className='shrink-0 gap-1 rounded-full text-xs'>
                    <span className='font-bold'>{examsSchedules.length}</span>{' '}
                    {examsSchedules.length === 1
                      ? t('exam:classroom_selector.exams_count_one')
                      : t('exam:classroom_selector.exams_count_other')}
                  </Badge>
                )}
                <div className='w-full sm:w-72'>
                  <Select
                    value={classroomId ?? undefined}
                    onValueChange={(value) => {
                      setClassroomId(value);
                      setSelectedExam(null);
                      setIsAddOpen(false);
                    }}
                  >
                    <SelectTrigger className='bg-background'>
                      <SelectValue placeholder='Select a classroom…' />
                    </SelectTrigger>
                    <SelectContent>
                      {classrooms.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                          {c.grade ? <span className='text-muted-foreground ml-1.5'>· {c.grade}</span> : null}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ── Exam Cards ── */}
        {!classroomId ? (
          <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center'>
            <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40'>
              <CalendarDays className='h-8 w-8 text-indigo-400' />
            </div>
            <p className='text-foreground text-base font-semibold'>{t('exam:no_classroom_selected.title')}</p>
            <p className='text-muted-foreground mt-1 text-sm'>{t('exam:no_classroom_selected.subtitle')}</p>
          </div>
        ) : isExamsScheduleLoading ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='bg-card animate-pulse rounded-2xl border p-5 shadow-sm'>
                <div className='bg-muted mb-3 h-4 w-2/3 rounded-md' />
                <div className='bg-muted mb-2 h-3 w-1/2 rounded-md' />
                <div className='bg-muted mb-4 h-3 w-3/4 rounded-md' />
                <Separator className='my-3' />
                <div className='flex items-center gap-3'>
                  <div className='bg-muted h-9 w-9 rounded-full' />
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
            <p className='text-foreground text-base font-semibold'>{t('exam:empty_state.title')}</p>
            <p className='text-muted-foreground mt-1 text-sm'>{t('exam:empty_state.subtitle')}</p>
            <Button
              onClick={() => setIsAddOpen(true)}
              className='mt-5 gap-2 rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
            >
              <Plus className='h-4 w-4' />
              {t('exam:headeer.add_exam')}
            </Button>
          </div>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {examsSchedules.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onEdit={() => handleEditClick(exam)}
                onDelete={() => handleDeleteClick(exam)}
              />
            ))}
          </div>
        )}
      </div>

      {isAddOpen && classroomId && examsSchedules && (
        <AddScheduleExam classroomId={classroomId} setIsOpen={setIsAddOpen} examsSchedules={examsSchedules} />
      )}

      {isEditOpen && classroomId && selectedExam && (
        <EditExamSchedule classroomId={classroomId} exam={selectedExam} setIsEditOpen={handleEditClose} />
      )}

      {isDeleteOpen && classroomId && selectedExam && (
        <DeleteScheduleExam classroomId={classroomId} examId={selectedExam.id} setIsDeleteOpen={handleDeleteClose} />
      )}
    </div>
  );
};

export default AdminExamScheduleOverview;
