import { attendanceService } from '@/api/service/attendanceService';
import { classroomsService } from '@/api/service/classroomsService';
import schoolService from '@/api/service/schoolService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import type { GetClassroomTimetableResponse } from '@repo/contracts/schemas/assignment/getClassroomTimetableResponse';
import { toWeekNbr } from '@repo/contracts/schemas/utils/getWeekNbr';
import { AttendanceStatus, DayOfWeek } from '@repo/contracts/types/enums/enums';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { BookOpen, CalendarDays, ChevronLeft, ChevronRight, Clock, Pencil, Users } from 'lucide-react';
import { useState } from 'react';
import EditAttendances from './components/edit-attendances';

// ─── helpers ────────────────────────────────────────────────────────────────

const getRecentMonday = () => {
  const today = dayjs();
  const daysSinceMonday = (today.day() + 6) % 7;
  return today.subtract(daysSinceMonday, 'day');
};

const DAY_ORDER: DayOfWeek[] = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
  DayOfWeek.SUNDAY,
];

const DAY_LABELS: Record<DayOfWeek, string> = {
  [DayOfWeek.MONDAY]: 'Monday',
  [DayOfWeek.TUESDAY]: 'Tuesday',
  [DayOfWeek.WEDNESDAY]: 'Wednesday',
  [DayOfWeek.THURSDAY]: 'Thursday',
  [DayOfWeek.FRIDAY]: 'Friday',
  [DayOfWeek.SATURDAY]: 'Saturday',
  [DayOfWeek.SUNDAY]: 'Sunday',
};

const STATUS_STYLES: Record<AttendanceStatus, { label: string; className: string }> = {
  [AttendanceStatus.PRESENT]: {
    label: 'Present',
    className:
      'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800',
  },
  [AttendanceStatus.ABSENT]: {
    label: 'Absent',
    className: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800',
  },
  [AttendanceStatus.LATE]: {
    label: 'Late',
    className:
      'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800',
  },
  [AttendanceStatus.EXCUSED]: {
    label: 'Excused',
    className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800',
  },
  [AttendanceStatus.EXCLUDED]: {
    label: 'Excluded',
    className:
      'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700',
  },
};

// ─── sub-components ──────────────────────────────────────────────────────────

const StatPill = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'slate' | 'emerald' | 'red' | 'amber';
}) => {
  const colors = {
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
    red: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  };
  return (
    <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${colors[color]}`}>
      <span className='text-base font-bold'>{value}</span>
      <span>{label}</span>
    </div>
  );
};

const EmptyState = () => (
  <div className='flex h-full min-h-[300px] flex-col items-center justify-center gap-3 text-center'>
    <div className='flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800'>
      <Users className='h-6 w-6 text-slate-400' />
    </div>
    <div>
      <p className='text-sm font-medium text-slate-600 dark:text-slate-300'>No data to display</p>
      <p className='mt-1 text-xs text-slate-400 dark:text-slate-500'>
        Select a classroom, session and week on the left to load attendance records.
      </p>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className='grid gap-2'>
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className='flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900'
      >
        <Skeleton className='h-9 w-9 rounded-full' />
        <div className='flex flex-1 flex-col gap-1.5'>
          <Skeleton className='h-3.5 w-32 rounded' />
          <Skeleton className='h-3 w-20 rounded' />
        </div>
        <Skeleton className='h-6 w-16 rounded-full' />
      </div>
    ))}
  </div>
);

const ErrorState = () => (
  <div className='flex h-full min-h-[300px] flex-col items-center justify-center gap-3 text-center'>
    <div className='flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50'>
      <span className='text-2xl'>⚠️</span>
    </div>
    <div>
      <p className='text-sm font-medium text-slate-700 dark:text-slate-200'>Failed to load attendance</p>
      <p className='mt-1 text-xs text-slate-400 dark:text-slate-500'>Something went wrong. Please try again.</p>
    </div>
  </div>
);

const NoDataState = () => (
  <div className='flex h-full min-h-[300px] flex-col items-center justify-center gap-3 text-center'>
    <div className='flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800'>
      <CalendarDays className='h-6 w-6 text-slate-400' />
    </div>
    <div>
      <p className='text-sm font-medium text-slate-600 dark:text-slate-300'>No attendance records</p>
      <p className='mt-1 text-xs text-slate-400 dark:text-slate-500'>No records found for this session and week.</p>
    </div>
  </div>
);

// ─── main component ──────────────────────────────────────────────────────────

const AttendanceOverview = () => {
  const schoolId = useCurrentSchoolId();

  const [currentWeek, setCurrentWeek] = useState<{ startDate: Date; endDate: Date }>({
    startDate: getRecentMonday().toDate(),
    endDate: getRecentMonday().add(6, 'day').toDate(),
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [classroomId, setClassroomId] = useState<string | null>(null);
  const [timetableId, setTimetableId] = useState<string | null>(null);

  const week = toWeekNbr(currentWeek.startDate);

  // ── classrooms ──────────────────────────────────────────────────────────────
  const { data: classroomsData } = useQuery({
    queryKey: ['classrooms', 'select'],
    queryFn: () => schoolService.selectClassrooms({ schoolId }),
  });
  const classrooms = classroomsData?.data ?? [];

  // ── timetable ───────────────────────────────────────────────────────────────
  const { data: timetableData, isFetching: isTimetableFetching } = useQuery({
    queryKey: ['classrooms', classroomId, 'timetable'],
    queryFn: async () =>
      classroomId ? await classroomsService.getClassroomTimetable({ schoolId, classroomId }) : undefined,
    enabled: !!classroomId,
  });

  const classroomTimetables: GetClassroomTimetableResponse = timetableData?.data ?? {
    [DayOfWeek.MONDAY]: [],
    [DayOfWeek.TUESDAY]: [],
    [DayOfWeek.WEDNESDAY]: [],
    [DayOfWeek.THURSDAY]: [],
    [DayOfWeek.FRIDAY]: [],
    [DayOfWeek.SATURDAY]: [],
    [DayOfWeek.SUNDAY]: [],
  };

  // ── attendances ─────────────────────────────────────────────────────────────
  const {
    data,
    isPending: isAttendancePending,
    isError,
  } = useQuery({
    queryKey: ['attendances', classroomId, timetableId, week],
    queryFn: async () =>
      classroomId && timetableId
        ? await attendanceService.get(schoolId, classroomId, { timetableId, week })
        : undefined,
    enabled: !!classroomId && !!timetableId,
  });
  const attendances = data?.data ?? [];

  // ── week navigation ─────────────────────────────────────────────────────────
  const goToPreviousWeek = () =>
    setCurrentWeek((prev) => ({
      startDate: dayjs(prev.startDate).subtract(7, 'day').toDate(),
      endDate: dayjs(prev.endDate).subtract(7, 'day').toDate(),
    }));

  const goToNextWeek = () =>
    setCurrentWeek((prev) => ({
      startDate: dayjs(prev.startDate).add(7, 'day').toDate(),
      endDate: dayjs(prev.endDate).add(7, 'day').toDate(),
    }));

  const isCurrentWeek = dayjs(currentWeek.startDate).isSame(getRecentMonday(), 'day');

  // ── derived values ──────────────────────────────────────────────────────────
  const allSessions = DAY_ORDER.flatMap((day) =>
    (classroomTimetables[day] ?? []).map((session) => ({ ...session, day })),
  );
  const selectedSession = allSessions.find((s) => s.id === timetableId);
  const selectedClassroom = classrooms.find((c) => c.id === classroomId);

  const presentCount = attendances.filter((a) => a.attendance?.status === AttendanceStatus.PRESENT).length;
  const absentCount = attendances.filter((a) => a.attendance?.status === AttendanceStatus.ABSENT).length;
  const lateCount = attendances.filter((a) => a.attendance?.status === AttendanceStatus.LATE).length;

  const isReady = !!classroomId && !!timetableId;

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className='h-screen p-8'>
      <div className='flex h-full min-h-0 gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950'>
        {/* ── LEFT PANEL ──────────────────────────────────────────────────────── */}
        <aside className='flex w-72 shrink-0 flex-col gap-6 border-r border-slate-200 bg-slate-50/60 p-6 dark:border-slate-800 dark:bg-slate-900/40'>
          <div>
            <h2 className='text-base font-semibold text-slate-800 dark:text-slate-100'>Filters</h2>
            <p className='mt-0.5 text-xs text-slate-500 dark:text-slate-400'>
              Select a classroom, session and week to load attendance.
            </p>
          </div>

          {/* 1 · Classroom */}
          <div className='flex flex-col gap-2'>
            <label className='flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400'>
              <Users className='h-3.5 w-3.5' />
              Classroom
            </label>
            <Select
              value={classroomId ?? ''}
              onValueChange={(val) => {
                setClassroomId(val);
                setTimetableId(null);
              }}
            >
              <SelectTrigger className='h-9 text-sm'>
                <SelectValue placeholder='Choose a classroom…' />
              </SelectTrigger>
              <SelectContent>
                {classrooms.length === 0 ? (
                  <div className='px-3 py-2 text-xs text-slate-400'>No classrooms found</div>
                ) : (
                  classrooms.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* 2 · Timetable Session */}
          <div className='flex flex-col gap-2'>
            <label className='flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400'>
              <BookOpen className='h-3.5 w-3.5' />
              Session
            </label>
            <Select
              value={timetableId ?? ''}
              onValueChange={setTimetableId}
              disabled={!classroomId || isTimetableFetching}
            >
              <SelectTrigger className='h-9 text-sm'>
                {isTimetableFetching ? (
                  <span className='text-slate-400'>Loading…</span>
                ) : (
                  <SelectValue placeholder={classroomId ? 'Choose a session…' : 'Select classroom first'} />
                )}
              </SelectTrigger>
              <SelectContent>
                {DAY_ORDER.map((day) => {
                  const sessions = classroomTimetables[day] ?? [];
                  if (sessions.length === 0) return null;
                  return (
                    <SelectGroup key={day}>
                      <SelectLabel className='text-xs font-semibold text-slate-500'>{DAY_LABELS[day]}</SelectLabel>
                      {sessions.map((session) => (
                        <SelectItem key={session.id} value={session.id}>
                          <span className='flex items-center gap-2'>
                            <Clock className='h-3 w-3 shrink-0 text-slate-400' />
                            <span>
                              {session.startTime} – {session.endTime}
                              <span className='ml-1.5 text-slate-500'>· {session.subject.name.en}</span>
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  );
                })}
                {allSessions.length === 0 && classroomId && !isTimetableFetching && (
                  <div className='px-3 py-2 text-xs text-slate-400'>No sessions found</div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* 3 · Week Picker */}
          <div className='flex flex-col gap-2'>
            <label className='flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400'>
              <CalendarDays className='h-3.5 w-3.5' />
              Week
            </label>
            <div className='flex items-center gap-1'>
              <Button
                variant='outline'
                size='icon'
                className='h-9 w-9 shrink-0'
                onClick={goToPreviousWeek}
                title='Previous week'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>

              <div className='flex flex-1 flex-col items-center rounded-md border border-slate-200 bg-white px-2 py-1.5 dark:border-slate-700 dark:bg-slate-900'>
                <span className='text-xs font-semibold text-slate-800 dark:text-slate-100'>Week {week}</span>
                <span className='text-[10px] text-slate-500 dark:text-slate-400'>
                  {dayjs(currentWeek.startDate).format('MMM D')} – {dayjs(currentWeek.endDate).format('MMM D, YYYY')}
                </span>
                {isCurrentWeek && (
                  <span className='mt-0.5 rounded-full bg-indigo-100 px-1.5 py-px text-[9px] font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'>
                    Current
                  </span>
                )}
              </div>

              <Button
                variant='outline'
                size='icon'
                className='h-9 w-9 shrink-0'
                onClick={goToNextWeek}
                title='Next week'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>

          {/* Session summary card */}
          {selectedSession && (
            <div className='rounded-xl border border-slate-200 bg-white p-3 text-xs dark:border-slate-700 dark:bg-slate-900'>
              <p className='mb-1 font-semibold text-slate-700 dark:text-slate-200'>{selectedSession.subject.name.en}</p>
              <p className='text-slate-500 dark:text-slate-400'>
                {DAY_LABELS[selectedSession.day]} · {selectedSession.startTime} – {selectedSession.endTime}
              </p>
              {selectedSession.teacher && (
                <p className='mt-1 text-slate-500 dark:text-slate-400'>
                  {selectedSession.teacher.firstName} {selectedSession.teacher.lastName}
                </p>
              )}
              {selectedSession.room && (
                <p className='text-slate-400 dark:text-slate-500'>Room {selectedSession.room}</p>
              )}
            </div>
          )}
        </aside>

        {/* ── RIGHT PANEL ─────────────────────────────────────────────────────── */}
        <main className='flex flex-1 flex-col overflow-hidden'>
          {/* header */}
          <div className='flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800'>
            <div>
              <h1 className='text-base font-semibold text-slate-800 dark:text-slate-100'>
                {selectedClassroom ? `${selectedClassroom.name} — Attendance` : 'Attendance'}
              </h1>
              {selectedSession && (
                <p className='text-xs text-slate-500 dark:text-slate-400'>
                  {DAY_LABELS[selectedSession.day]} · {selectedSession.startTime}–{selectedSession.endTime} ·{' '}
                  {selectedSession.subject.name.en} · Week {week}
                </p>
              )}
            </div>

            {isReady && attendances.length > 0 && (
              <Button size='sm' className='gap-1.5' onClick={() => setIsEditOpen(true)}>
                <Pencil className='h-3.5 w-3.5' />
                Edit Attendance
              </Button>
            )}
          </div>

          {/* stats */}
          {isReady && !isAttendancePending && attendances.length > 0 && (
            <div className='flex gap-3 border-b border-slate-200 px-6 py-3 dark:border-slate-800'>
              <StatPill label='Total' value={attendances.length} color='slate' />
              <StatPill label='Present' value={presentCount} color='emerald' />
              <StatPill label='Absent' value={absentCount} color='red' />
              <StatPill label='Late' value={lateCount} color='amber' />
            </div>
          )}

          {/* content */}
          <div className='flex-1 overflow-y-auto px-6 py-4'>
            {!isReady ? (
              <EmptyState />
            ) : isAttendancePending ? (
              <LoadingSkeleton />
            ) : isError ? (
              <ErrorState />
            ) : attendances.length === 0 ? (
              <NoDataState />
            ) : (
              <div className='grid gap-2'>
                {attendances.map((student) => {
                  const status = student.attendance?.status;
                  const statusStyle = status ? STATUS_STYLES[status] : null;
                  const initials = (student.firstName.en?.[0] ?? '') + (student.lastName.en?.[0] ?? '');

                  return (
                    <div
                      key={student.id}
                      className='flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/50'
                    >
                      <Avatar className='h-9 w-9 shrink-0'>
                        {student.avatar?.key && (
                          <AvatarImage
                            src={student.avatar.key}
                            alt={`${student.firstName.en} ${student.lastName.en}`}
                          />
                        )}
                        <AvatarFallback className='text-xs font-semibold'>{initials}</AvatarFallback>
                      </Avatar>

                      <div className='flex min-w-0 flex-1 flex-col'>
                        <span className='truncate text-sm font-medium text-slate-800 dark:text-slate-100'>
                          {student.firstName.en} {student.lastName.en}
                        </span>
                        {student.firstName.ar && (
                          <span className='truncate text-xs text-slate-500 dark:text-slate-400' dir='rtl'>
                            {student.firstName.ar} {student.lastName.ar}
                          </span>
                        )}
                        {student.attendance?.note && (
                          <span className='mt-0.5 truncate text-xs text-slate-400 italic dark:text-slate-500'>
                            {student.attendance.note}
                          </span>
                        )}
                      </div>

                      <div className='flex shrink-0 flex-col items-end gap-1'>
                        {statusStyle ? (
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyle.className}`}
                          >
                            {statusStyle.label}
                          </span>
                        ) : (
                          <span className='rounded-full border border-dashed border-slate-300 px-2.5 py-0.5 text-xs text-slate-400 dark:border-slate-600'>
                            Not recorded
                          </span>
                        )}
                        {!student.attendance && student.lastAttendance?.status && (
                          <span className='text-[10px] text-slate-400 dark:text-slate-500'>
                            Last: {STATUS_STYLES[student.lastAttendance.status]?.label ?? student.lastAttendance.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        {/* ── EDIT DIALOG ─────────────────────────────────────────────────────── */}
        {isEditOpen && timetableId && (
          <EditAttendances
            attendances={attendances}
            timetableId={timetableId}
            week={week}
            setIsEditOpen={setIsEditOpen}
          />
        )}
      </div>
    </div>
  );
};

export default AttendanceOverview;
