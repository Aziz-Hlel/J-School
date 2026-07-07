import { classroomsService } from '@/api/service/classroomsService';
import schoolService from '@/api/service/schoolService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import BreadcrumbHeader from '@/pages/Header';
import type { GetClassroomTimetableResponse } from '@repo/contracts/schemas/assignment/getClassroomTimetableResponse';
import type { DayOfWeek } from '@repo/contracts/types/enums/enums';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, CalendarDays, Clock, DoorClosed, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AddTimetable from './add-timetable';
import DeleteTimetable from './delete-timetable';

// ─── Constants ───────────────────────────────────────────────────────────────

const ORDERED_DAYS: { key: DayOfWeek; short: string; label: string }[] = [
  { key: 'MONDAY', short: 'MON', label: 'Monday' },
  { key: 'TUESDAY', short: 'TUE', label: 'Tuesday' },
  { key: 'WEDNESDAY', short: 'WED', label: 'Wednesday' },
  { key: 'THURSDAY', short: 'THU', label: 'Thursday' },
  { key: 'FRIDAY', short: 'FRI', label: 'Friday' },
  { key: 'SATURDAY', short: 'SAT', label: 'Saturday' },
  { key: 'SUNDAY', short: 'SUN', label: 'Sunday' },
];

const DAY_BADGE: Record<DayOfWeek, string> = {
  MONDAY: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  TUESDAY: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  WEDNESDAY: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  THURSDAY: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  FRIDAY: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  SATURDAY: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  SUNDAY: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Session = GetClassroomTimetableResponse[DayOfWeek][number];

// ─── Session Card ─────────────────────────────────────────────────────────────

function SessionCard({ session, onDelete }: { session: Session; onDelete: (session: Session) => void }) {
  const teacherName = session.teacher ? `${session.teacher.firstName} ${session.teacher.lastName}` : null;

  const initials = session.teacher
    ? `${session.teacher.firstName[0]}${session.teacher.lastName[0]}`.toUpperCase()
    : '?';

  return (
    <div className='group border-border/60 bg-card hover:border-border relative flex min-w-50 flex-col gap-2.5 rounded-xl border p-4 shadow-sm transition-all duration-200 hover:shadow-md'>
      {/* Delete button */}
      <button
        onClick={() => onDelete(session)}
        className='text-muted-foreground hover:bg-destructive/10 hover:text-destructive absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-md opacity-0 transition-all group-hover:opacity-100'
        title='Delete session'
      >
        <Trash2 className='h-3.5 w-3.5' />
      </button>

      {/* Subject */}
      <div className='flex items-start gap-2 pr-6'>
        <div className='bg-primary/10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg'>
          <BookOpen className='text-primary h-3.5 w-3.5' />
        </div>
        <p className='text-foreground text-sm leading-snug font-semibold'>{session.subject.name.en}</p>
      </div>

      <Separator className='opacity-50' />

      {/* Time */}
      <div className='text-muted-foreground flex items-center gap-1.5 text-xs'>
        <Clock className='h-3 w-3 shrink-0' />
        <span className='font-medium tabular-nums'>
          {session.startTime} – {session.endTime}
        </span>
      </div>

      {/* Room */}
      {session.room && (
        <div className='text-muted-foreground flex items-center gap-1.5 text-xs'>
          <DoorClosed className='h-3 w-3 shrink-0' />
          <span>{session.room}</span>
        </div>
      )}

      {/* Teacher */}
      <div className='flex items-center gap-2 pt-0.5'>
        <div className='bg-muted text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold'>
          {initials}
        </div>
        <span className='text-muted-foreground truncate text-xs'>
          {teacherName ?? <em className='not-italic opacity-50'>No teacher</em>}
        </span>
      </div>
    </div>
  );
}

// ─── Empty Day Placeholder ────────────────────────────────────────────────────

function EmptyDaySlot() {
  return (
    <div className='border-border/50 bg-muted/20 flex h-29.5 min-w-40 items-center justify-center rounded-xl border border-dashed'>
      <p className='text-muted-foreground/50 text-xs'>No sessions</p>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TimetableSkeleton() {
  return (
    <div className='space-y-3'>
      {ORDERED_DAYS.map(({ key }) => (
        <div key={key} className='border-border/40 bg-card/50 flex items-start gap-4 rounded-2xl border p-4'>
          <div className='w-24 shrink-0 space-y-1.5'>
            <div className='bg-muted h-3 w-12 animate-pulse rounded' />
            <div className='bg-muted/60 h-2 w-16 animate-pulse rounded' />
          </div>
          <div className='flex gap-3'>
            {[1, 2].map((n) => (
              <div key={n} className='bg-muted h-29.5 w-50 animate-pulse rounded-xl' />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const TimetableOverview = () => {
  const schoolId = useCurrentSchoolId();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [classroomId, setClassroomId] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const { data: classroomsData } = useQuery({
    queryKey: ['classrooms', 'select'],
    queryFn: () => schoolService.selectClassrooms({ schoolId }),
  });
  const classrooms = classroomsData?.data ?? [];

  const { data: timetableData, isLoading: isTimetableLoading } = useQuery({
    queryKey: ['classrooms', classroomId, 'timetable'],
    queryFn: async () =>
      classroomId ? await classroomsService.getClassroomTimetable({ schoolId, classroomId }) : undefined,
    enabled: Boolean(classroomId),
  });

  const timetables = timetableData?.data;

  const handleDeleteClick = (session: Session) => {
    setSelectedSession(session);
    setIsDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
    setSelectedSession(null);
  };

  const totalSessions = timetables ? Object.values(timetables).reduce((acc, arr) => acc + arr.length, 0) : 0;

  return (
    <div className='bg-background min-h-screen'>
      <BreadcrumbHeader breadcrumbs={[{ title: 'Timetable', href: '/timetable' }]} />

      <div className='mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6'>
        {/* ── Top bar ── */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-foreground text-xl font-bold tracking-tight'>Weekly Timetable</h1>
            <p className='text-muted-foreground mt-0.5 text-sm'>Manage class sessions for each day of the week</p>
          </div>

          {classroomId && (
            <Button
              onClick={() => setIsAddOpen(true)}
              className='gap-2 rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
            >
              <Plus className='h-4 w-4' />
              Add Session
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
                  <p className='text-sm font-semibold'>Select Classroom</p>
                  <p className='text-muted-foreground text-xs'>View the weekly schedule for a classroom</p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                {timetables && (
                  <Badge variant='secondary' className='shrink-0 gap-1 rounded-full text-xs'>
                    <span className='font-bold'>{totalSessions}</span> sessions
                  </Badge>
                )}
                <div className='w-full sm:w-72'>
                  <Select
                    value={classroomId ?? undefined}
                    onValueChange={(value) => {
                      setClassroomId(value);
                      setSelectedSession(null);
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

        {/* ── Timetable grid ── */}
        {!classroomId ? (
          /* Prompt */
          <div className='border-border/60 bg-muted/10 flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center'>
            <div className='bg-muted mb-4 flex h-14 w-14 items-center justify-center rounded-2xl'>
              <CalendarDays className='text-muted-foreground h-6 w-6' />
            </div>
            <p className='text-foreground text-base font-semibold'>No classroom selected</p>
            <p className='text-muted-foreground mt-1 text-sm'>
              Select a classroom above to view and manage its timetable.
            </p>
          </div>
        ) : isTimetableLoading ? (
          <TimetableSkeleton />
        ) : (
          <div className='space-y-3'>
            {ORDERED_DAYS.map(({ key, short, label }) => {
              const sessions: Session[] = timetables?.[key] ?? [];

              return (
                <div
                  key={key}
                  className='border-border/50 bg-card flex items-start gap-0 overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-md'
                >
                  {/* Day label strip */}
                  <div className='border-border/40 bg-muted/20 flex w-24 shrink-0 flex-col items-center justify-start gap-1 self-stretch border-r px-3 py-4'>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold tracking-widest ${DAY_BADGE[key]}`}
                    >
                      {short}
                    </span>
                    <span className='text-muted-foreground mt-0.5 text-[10px]'>{label}</span>
                    <span className='text-muted-foreground/60 mt-auto text-[10px] font-medium'>
                      {sessions.length > 0 ? `${sessions.length} session${sessions.length > 1 ? 's' : ''}` : 'free'}
                    </span>
                  </div>

                  {/* Sessions row — horizontally scrollable */}
                  <div className='scrollbar-thumb-border flex flex-1 scrollbar-thin scrollbar-track-transparent gap-3 overflow-x-auto p-4'>
                    {sessions.length === 0 ? (
                      <EmptyDaySlot />
                    ) : (
                      sessions
                        .slice()
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .map((session) => (
                          <SessionCard key={session.id} session={session} onDelete={handleDeleteClick} />
                        ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Dialogs ── */}
      {isAddOpen && classroomId && <AddTimetable classroomId={classroomId} setIsOpen={setIsAddOpen} />}

      {isDeleteOpen && classroomId && selectedSession && (
        <DeleteTimetable
          classroomId={classroomId}
          timetableId={selectedSession.id}
          setIsDeleteOpen={handleDeleteClose}
        />
      )}
    </div>
  );
};

export default TimetableOverview;
