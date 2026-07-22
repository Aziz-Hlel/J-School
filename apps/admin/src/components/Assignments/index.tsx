import { classroomsService } from '@/api/service/classroomsService';
import schoolService from '@/api/service/schoolService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import BreadcrumbHeader from '@/pages/Header';
import type { ClassroomSubjectsWithTeachersResponse } from '@repo/contracts/schemas/classroom/management/ClassroomSubjectsWithTeachers';
import type { SubjectDomain } from '@repo/contracts/types/enums/enums';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, ChevronRight, Clock, GraduationCap, Layers } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditAssignment from './edit-assignment';

// Domain → subtle accent color
const DOMAIN_COLORS: Record<SubjectDomain, string> = {
  ARABIC_LANGUAGE: '#3b82f6',
  ART_EDUCATION: '#8b5cf6',
  ENGLISH_LANGUAGE: '#10b981',
  FRENCH_LANGUAGE: '#f59e0b',
  PHYSICAL_EDUCATION: '#ef4444',
  SCIENCE_TECHNOLOGY: '#06b6d4',
  SOCIAL_EDUCATION: '#06b6d4',
};

function domainColor(domain: string) {
  return DOMAIN_COLORS[domain as SubjectDomain] ?? '#6b7280';
}

const Assignments = () => {
  const { t, i18n } = useTranslation(['assignments']);
  const schoolId = useCurrentSchoolId();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [classroomId, setClassroomId] = useState<string | null>(null);
  const [assignment, setAssignment] = useState<ClassroomSubjectsWithTeachersResponse | null>(null);

  const { data: classroomsData } = useQuery({
    queryKey: ['classrooms', 'select'],
    queryFn: () => schoolService.selectClassrooms({ schoolId }),
  });
  const classrooms = classroomsData?.data ?? [];

  const {
    data: assignmentsData,
    isLoading: isAssignmentsLoading,
    isFetching: isAssignmentsFetching,
  } = useQuery({
    queryKey: ['classrooms', classroomId, 'subjects'],
    queryFn: async () => (classroomId ? await classroomsService.subjects({ schoolId, classroomId }) : undefined),
    enabled: Boolean(classroomId),
  });

  const assignments = assignmentsData?.data ?? [];

  function openEdit(subject: ClassroomSubjectsWithTeachersResponse) {
    setAssignment(subject);
    setIsEditOpen(true);
  }

  return (
    <div>
      <BreadcrumbHeader breadcrumbs={[{ title: t('assignments:pageTitle'), href: '/assignments' }]} />

      <div className='mx-auto w-full space-y-6 p-4'>
        {/* Classroom selector */}
        <Card className='overflow-hidden border shadow-sm'>
          <div className='bg-muted/40 border-b px-5 py-4'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='text-sm font-semibold'>{t('assignments:selector.label')}</p>
                <p className='text-muted-foreground mt-0.5 text-xs'>{t('assignments:selector.description')}</p>
              </div>
              <div className='w-full sm:w-72'>
                <Select
                  value={classroomId ?? undefined}
                  onValueChange={(value) => {
                    setClassroomId(value);
                    setAssignment(null);
                    setIsEditOpen(false);
                  }}
                >
                  <SelectTrigger className='bg-background'>
                    <SelectValue placeholder={t('assignments:selector.placeholder')} />
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

          {/* Stats row — only when a classroom is selected */}
          {classroomId && !isAssignmentsLoading && (
            <div className='flex divide-x text-center'>
              <div className='flex-1 py-3'>
                <p className='text-lg font-semibold tabular-nums'>{assignments.length}</p>
                <p className='text-muted-foreground text-xs'>{t('assignments:stats.subjects')}</p>
              </div>
              <div className='flex-1 py-3'>
                <p className='text-lg font-semibold tabular-nums'>{assignments.filter((s) => s.teacher).length}</p>
                <p className='text-muted-foreground text-xs'>{t('assignments:stats.assigned')}</p>
              </div>
              <div className='flex-1 py-3'>
                <p className='text-lg font-semibold tabular-nums'>{assignments.filter((s) => !s.teacher).length}</p>
                <p className='text-muted-foreground text-xs'>{t('assignments:stats.unassigned')}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Body */}
        {!classroomId ? (
          <div className='bg-muted/30 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center'>
            <div className='bg-muted flex h-12 w-12 items-center justify-center rounded-full'>
              <Layers className='text-muted-foreground h-5 w-5' />
            </div>
            <div>
              <p className='text-sm font-medium'>{t('assignments:emptyStates.noClassroom.title')}</p>
              <p className='text-muted-foreground mt-0.5 text-xs'>
                {t('assignments:emptyStates.noClassroom.description')}
              </p>
            </div>
          </div>
        ) : isAssignmentsLoading ? (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className='overflow-hidden border shadow-sm'>
                <div className='bg-muted h-1 w-full animate-pulse' />
                <CardContent className='space-y-3 p-4'>
                  <div className='bg-muted h-4 w-2/3 animate-pulse rounded' />
                  <div className='bg-muted h-3 w-1/3 animate-pulse rounded' />
                  <Separator />
                  <div className='flex items-center gap-3'>
                    <div className='bg-muted h-9 w-9 animate-pulse rounded-full' />
                    <div className='flex-1 space-y-1.5'>
                      <div className='bg-muted h-3 w-1/2 animate-pulse rounded' />
                      <div className='bg-muted h-2.5 w-1/3 animate-pulse rounded' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : assignments.length === 0 ? (
          <div className='bg-muted/30 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center'>
            <div className='bg-muted flex h-12 w-12 items-center justify-center rounded-full'>
              <BookOpen className='text-muted-foreground h-5 w-5' />
            </div>
            <div>
              <p className='text-sm font-medium'>{t('assignments:emptyStates.noSubjects.title')}</p>
              <p className='text-muted-foreground mt-0.5 text-xs'>
                {t('assignments:emptyStates.noSubjects.description')}
              </p>
            </div>
          </div>
        ) : (
          <>
            {isAssignmentsFetching && (
              <p className='text-muted-foreground text-xs'>{t('assignments:status.refreshing')}</p>
            )}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {assignments.map((subject) => {
                const teacher = subject.teacher;
                const subjectName = subject.name[i18n.language as keyof typeof subject.name] || subject.name.en;
                const teacherName = teacher
                  ? `${teacher.firstName} ${teacher.lastName}`
                  : t('assignments:fields.teacher.none');
                const accent = domainColor(subject.domain);

                return (
                  <Card
                    key={subject.id}
                    className='group relative overflow-hidden border shadow-sm transition-shadow hover:shadow-md'
                  >
                    {/* Domain accent strip */}
                    <div className='h-1 w-full' style={{ backgroundColor: accent }} />

                    <CardContent className='p-4'>
                      {/* Header */}
                      <div className='flex items-start justify-between gap-2'>
                        <div className='min-w-0'>
                          <p className='truncate text-sm leading-snug font-semibold'>{subjectName}</p>
                          <div className='mt-1.5 flex flex-wrap gap-1.5'>
                            <span
                              className='inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium'
                              style={{
                                backgroundColor: `${accent}18`,
                                color: accent,
                              }}
                            >
                              {subject.domain}
                            </span>
                            <Badge variant='secondary' className='gap-1 text-xs'>
                              <GraduationCap className='h-3 w-3' />
                              {subject.grade}
                            </Badge>
                            <Badge variant='outline' className='gap-1 text-xs'>
                              <Clock className='h-3 w-3' />
                              {t('assignments:hoursPerWeekShort', { count: subject.hoursPerWeek })}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Separator className='my-3' />

                      {/* Teacher row */}
                      <div
                        className='hover:bg-muted/50 -mx-2 flex cursor-pointer items-center justify-between gap-3 rounded-lg p-2 transition-colors'
                        onClick={() => openEdit(subject)}
                        role='button'
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && openEdit(subject)}
                        aria-label={`${t('assignments:accessibility.changeTeacher')} ${subjectName}`}
                      >
                        <div className='flex min-w-0 items-center gap-2.5'>
                          <Avatar className='h-8 w-8 shrink-0'>
                            <AvatarImage src={teacher?.avatar?.url ?? undefined} alt={teacherName} />
                            <AvatarFallback className='text-xs'>
                              {teacher ? teacher.firstName[0] + teacher.lastName[0] : '—'}
                            </AvatarFallback>
                          </Avatar>
                          <div className='min-w-0'>
                            <p className='truncate text-xs font-medium'>{teacherName}</p>
                            <p className='text-muted-foreground truncate text-xs'>
                              {teacher
                                ? t(`assignments:genders.${teacher.gender.toLowerCase()}`, {
                                    defaultValue: teacher.gender,
                                  })
                                : t('assignments:emptyStates.noTeacherAssigned')}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className='text-muted-foreground/60 h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5' />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>

      {isEditOpen && classroomId && assignment && (
        <EditAssignment
          subject={assignment}
          isEditOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
          classroomId={classroomId}
        />
      )}
    </div>
  );
};

export default Assignments;
