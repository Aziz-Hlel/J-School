import { calendarService } from '@/api/service/calendarService';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { useIsCurrentUserAdmin } from '@/hooks/useIsCurrentUserAdmin';
import type { CalendarQueryParams } from '@repo/contracts/schemas/Calendar/queryParam';
import type { CalendarResponse } from '@repo/contracts/schemas/Calendar/response';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
  AlignLeft,
  CalendarCheck2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import AddCalendar from './components/add-calendar';
import DeleteCalendar from './components/delete-calendar';
import EditCalendar from './components/edit-calendar';
import {
  getCurrentMonthRange,
  getMonthLabel,
  getNextMonthRange,
  getPreviousMonthRange,
} from './helpers/getMonthIntervall';
import { useTranslation } from 'react-i18next';

// ─── Type colour config ───────────────────────────────────────────────────────
type CalendarSessionType = 'EVENT' | 'OTHER' | 'PUBLIC_HOLIDAY' | 'SCHOOL_HOLIDAY' | 'TRIP';

const TYPE_CONFIG: Record<CalendarSessionType, { label: string; color: string; dot: string; badge: string }> = {
  EVENT: {
    label: 'Event',
    color: 'bg-violet-500',
    dot: 'bg-violet-500',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  },
  PUBLIC_HOLIDAY: {
    label: 'Public Holiday',
    color: 'bg-rose-500',
    dot: 'bg-rose-500',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  },
  SCHOOL_HOLIDAY: {
    label: 'School Holiday',
    color: 'bg-amber-500',
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
  TRIP: {
    label: 'Trip',
    color: 'bg-teal-500',
    dot: 'bg-teal-500',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  },
  OTHER: {
    label: 'Other',
    color: 'bg-slate-500',
    dot: 'bg-slate-500',
    badge: 'bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-300',
  },
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildCalendarGrid(startDate: Date) {
  const monthStart = dayjs(startDate).startOf('month');
  const monthEnd = dayjs(startDate).endOf('month');
  const gridStart = monthStart.startOf('week');
  const gridEnd = monthEnd.endOf('week');

  const days: dayjs.Dayjs[] = [];
  let cur = gridStart;
  while (cur.isBefore(gridEnd) || cur.isSame(gridEnd, 'day')) {
    days.push(cur);
    cur = cur.add(1, 'day');
  }
  return { days, monthStart, monthEnd };
}

function getEventsForDay(events: CalendarResponse[], day: dayjs.Dayjs) {
  return events.filter((ev) => {
    const start = dayjs(ev.startDate);
    const end = dayjs(ev.endDate);
    return (
      (day.isSame(start, 'day') || day.isAfter(start, 'day')) && (day.isSame(end, 'day') || day.isBefore(end, 'day'))
    );
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function EventTypeBadge({ type }: { type: CalendarSessionType }) {
  const cfg = TYPE_CONFIG[type];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function EventCard({
  event,
  onEdit,
  onDelete,
}: {
  event: CalendarResponse;
  onEdit: (ev: CalendarResponse) => void;
  onDelete: (ev: CalendarResponse) => void;
}) {
  const cfg = TYPE_CONFIG[event.type as CalendarSessionType];
  const isSameDay = event.startDate === event.endDate;
  const dateLabel = isSameDay
    ? dayjs(event.startDate).format('D MMM YYYY')
    : `${dayjs(event.startDate).format('D MMM')} – ${dayjs(event.endDate).format('D MMM YYYY')}`;

  const isAdmin = useIsCurrentUserAdmin();
  return (
    <div className='group border-border bg-card hover:border-primary/30 flex items-start gap-3 rounded-xl border p-4 shadow-sm transition-all duration-200 hover:shadow-md'>
      {/* colour stripe */}
      <div className={`mt-0.5 h-full min-h-12 w-1 rounded-full ${cfg.color} shrink-0`} />

      <div className='min-w-0 flex-1'>
        <div className='flex items-start justify-between gap-2'>
          <p className='text-foreground truncate text-sm font-semibold'>{event.title}</p>
          {isAdmin && (
            <div className='flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
              <Button
                variant='ghost'
                size='icon'
                className='text-muted-foreground hover:text-foreground h-7 w-7'
                onClick={() => onEdit(event)}
                aria-label='Edit event'
              >
                <Pencil className='h-3.5 w-3.5' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='text-muted-foreground hover:text-destructive h-7 w-7'
                onClick={() => onDelete(event)}
                aria-label='Delete event'
              >
                <Trash2 className='h-3.5 w-3.5' />
              </Button>
            </div>
          )}
        </div>

        <div className='mt-1.5 flex flex-wrap items-center gap-2'>
          <EventTypeBadge type={event.type as CalendarSessionType} />
          <span className='text-muted-foreground flex items-center gap-1 text-xs'>
            <CalendarCheck2 className='h-3 w-3' />
            {dateLabel}
          </span>
          {(event.startTime || event.endTime) && (
            <span className='text-muted-foreground flex items-center gap-1 text-xs'>
              <Clock className='h-3 w-3' />
              {event.startTime}
              {event.endTime ? ` – ${event.endTime}` : ''}
            </span>
          )}
        </div>

        {event.description && (
          <p className='text-muted-foreground mt-2 line-clamp-2 flex items-start gap-1 text-xs'>
            <AlignLeft className='mt-0.5 h-3 w-3 shrink-0' />
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Calendar grid day cell ────────────────────────────────────────────────────
function DayCell({
  day,
  isCurrentMonth,
  isToday,
  events,
  isSelected,
  onClick,
}: {
  day: dayjs.Dayjs;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarResponse[];
  isSelected: boolean;
  onClick: () => void;
}) {
  const MAX_DOTS = 3;
  const visibleTypes = [...new Set(events.map((e) => e.type as CalendarSessionType))].slice(0, MAX_DOTS);

  return (
    <button
      onClick={onClick}
      className={`relative flex h-1/2 w-1/2 cursor-pointer flex-col items-center rounded-xl p-1.5 transition-all duration-150 select-none ${isCurrentMonth ? 'hover:bg-muted' : 'opacity-40'} ${isSelected ? 'ring-primary bg-primary/5 ring-2' : ''} `}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium transition-colors ${isToday ? 'bg-primary text-primary-foreground font-bold' : 'text-foreground'} `}
      >
        {day.date()}
      </span>
      {/* event dots */}
      {events.length > 0 && (
        <div className='mt-1 flex items-center gap-0.5'>
          {visibleTypes.map((type) => (
            <span key={type} className={`h-1.5 w-1.5 rounded-full ${TYPE_CONFIG[type].dot}`} />
          ))}
          {events.length > MAX_DOTS && (
            <span className='text-muted-foreground text-[9px] leading-none'>+{events.length - MAX_DOTS}</span>
          )}
        </div>
      )}
    </button>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────
function Legend() {
  return (
    <div className='flex flex-wrap items-center gap-3'>
      {(Object.keys(TYPE_CONFIG) as CalendarSessionType[]).map((type) => {
        const cfg = TYPE_CONFIG[type];
        return (
          <span key={type} className='text-muted-foreground flex items-center gap-1.5 text-xs'>
            <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        );
      })}
    </div>
  );
}

// ─── Loading skeletons ────────────────────────────────────────────────────────
function CalendarSkeleton() {
  return (
    <div className='space-y-3'>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className='h-20 w-full rounded-xl' />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const CalendarIndex = () => {
  const schoolId = useCurrentSchoolId();
  const [currentMonth, setCurrentMonth] = useState<CalendarQueryParams>(getCurrentMonthRange());
  const [selectedDay, setSelectedDay] = useState<dayjs.Dayjs | null>(null);

  const isAdmin = useIsCurrentUserAdmin();
  // Edit / Delete state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentCalendarItem, setCurrentCalendarItem] = useState<CalendarResponse | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ['calendar', JSON.stringify(currentMonth)],
    queryFn: () => calendarService.getCalendar(schoolId, currentMonth),
  });

  const calendar: CalendarResponse[] = data?.data ?? [];

  // ── Grid ──
  const { days, monthStart } = useMemo(() => buildCalendarGrid(currentMonth.startDate as Date), [currentMonth]);

  const today = dayjs();
  const monthLabel = getMonthLabel(currentMonth.startDate as Date);

  // ── Navigation ──
  const goToPrev = () => setCurrentMonth(getPreviousMonthRange(currentMonth.startDate as Date));
  const goToNext = () => setCurrentMonth(getNextMonthRange(currentMonth.startDate as Date));
  const goToToday = () => {
    setCurrentMonth(getCurrentMonthRange());
    setSelectedDay(today);
  };

  // ── Selected day events ──
  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) return [];
    return getEventsForDay(calendar, selectedDay);
  }, [selectedDay, calendar]);

  // ── All events for the month sorted by start date ──
  const sortedEvents = useMemo(
    () => [...calendar].sort((a, b) => dayjs(a.startDate).diff(dayjs(b.startDate))),
    [calendar],
  );

  // ── Handlers ──
  const handleEdit = (ev: CalendarResponse) => {
    setCurrentCalendarItem(ev);
    setIsEditOpen(true);
  };
  const handleDelete = (ev: CalendarResponse) => {
    setCurrentCalendarItem(ev);
    setIsDeleteOpen(true);
  };

  // ── Displayed events panel (selected day or full month) ──
  const panelEvents = selectedDay ? selectedDayEvents : sortedEvents;
  const { t } = useTranslation(['calendrier']);
  const panelTitle = selectedDay
    ? t('panel.eventsOnDay', { date: selectedDay.format('D MMMM') })
    : t('panel.allEventsForMonth', { month: monthLabel });

  return (
    <TooltipProvider>
      <div className='flex min-h-full flex-col gap-6 p-6'>
        {/* ── Header ── */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl'>
              <CalendarDays className='h-5 w-5' />
            </div>
            <div>
              <h1 className='text-foreground text-xl font-bold'>{t('header.title')}</h1>
              <p className='text-muted-foreground text-sm'>{t('header.description')}</p>
            </div>
          </div>

          {isAdmin && (
            <AddCalendar>
              <Button id='add-calendar-btn' className='gap-2 shadow-sm'>
                <Plus className='h-4 w-4' />
                {t('header.addEvent')}
              </Button>
            </AddCalendar>
          )}
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]'>
          {/* ── Left: Calendar grid ── */}
          <div className='flex flex-col gap-4'>
            {/* Month navigation */}
            <div className='border-border bg-card flex items-center justify-between rounded-xl border px-4 py-3 shadow-sm'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    id='prev-month-btn'
                    variant='ghost'
                    size='icon'
                    onClick={goToPrev}
                    className='h-8 w-8'
                    aria-label='Previous month'
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Previous month</TooltipContent>
              </Tooltip>

              <div className='flex items-center gap-2'>
                <h2 className='text-foreground text-base font-semibold'>{monthLabel}</h2>
                {!today.isSame(dayjs(currentMonth.startDate as Date), 'month') && (
                  <Button variant='outline' size='sm' onClick={goToToday} className='h-6 px-2 text-xs'>
                    Today
                  </Button>
                )}
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    id='next-month-btn'
                    variant='ghost'
                    size='icon'
                    onClick={goToNext}
                    className='h-8 w-8'
                    aria-label='Next month'
                  >
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Next month</TooltipContent>
              </Tooltip>
            </div>

            {/* Grid */}
            <div className='border-border bg-card overflow-hidden rounded-xl border shadow-sm'>
              {/* Weekday headers */}
              <div className='border-border grid grid-cols-7 border-b'>
                {WEEKDAYS.map((d) => (
                  <div
                    key={d}
                    className='text-muted-foreground py-2 text-center text-xs font-semibold tracking-wide uppercase'
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className='bg-border grid grid-cols-7 gap-px p-px'>
                {days.map((day) => {
                  const isCurrentMonth = day.month() === monthStart.month() && day.year() === monthStart.year();
                  const isToday = day.isSame(today, 'day');
                  const eventsForDay = getEventsForDay(calendar, day);
                  const isSelected = selectedDay ? day.isSame(selectedDay, 'day') : false;

                  return (
                    <div
                      key={day.toString()}
                      className='bg-card flex min-h-24 w-full items-center justify-center p-0.5'
                    >
                      <DayCell
                        day={day}
                        isCurrentMonth={isCurrentMonth}
                        isToday={isToday}
                        events={eventsForDay}
                        isSelected={isSelected}
                        onClick={() => {
                          if (selectedDay && day.isSame(selectedDay, 'day')) {
                            setSelectedDay(null);
                          } else {
                            setSelectedDay(day);
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <Legend />
          </div>

          {/* ── Right: Events panel ── */}
          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-foreground text-sm font-semibold'>{panelTitle}</h3>
              {selectedDay && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-muted-foreground h-7 px-2 text-xs'
                  onClick={() => setSelectedDay(null)}
                >
                  Show all
                </Button>
              )}
            </div>

            <Separator />

            {isPending ? (
              <CalendarSkeleton />
            ) : isError ? (
              <div className='flex flex-col items-center gap-2 py-10 text-center'>
                <CalendarDays className='text-muted-foreground/40 h-8 w-8' />
                <p className='text-muted-foreground text-sm'>{t('panel.errorLoading')}</p>
              </div>
            ) : panelEvents.length === 0 ? (
              <div className='flex flex-col items-center gap-2 py-10 text-center'>
                <CalendarDays className='text-muted-foreground/40 h-8 w-8' />
                <p className='text-muted-foreground text-sm font-medium'>{t('panel.noEvents')}</p>
                <p className='text-muted-foreground/70 text-xs'>
                  {selectedDay ? t('panel.noEventsForDay') : t('panel.noEventsForMonth')}{' '}
                </p>
                {isAdmin && (
                  <AddCalendar>
                    <Button variant='outline' size='sm' className='mt-1 gap-1.5'>
                      <Plus className='h-3.5 w-3.5' />
                      {t('header.addEvent')}
                    </Button>
                  </AddCalendar>
                )}
              </div>
            ) : (
              <div className='flex flex-col gap-3 overflow-y-auto pr-0.5' style={{ maxHeight: '620px' }}>
                {panelEvents.map((ev) => (
                  <EventCard key={ev.id} event={ev} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Edit dialog ── */}
        {isEditOpen && currentCalendarItem && (
          <EditCalendar
            calendar={currentCalendarItem}
            open={isEditOpen}
            onOpenChange={(open) => {
              setIsEditOpen(open);
              if (!open) setCurrentCalendarItem(null);
            }}
          />
        )}

        {/* ── Delete dialog ── */}
        {isDeleteOpen && currentCalendarItem && (
          <DeleteCalendar
            calendarId={currentCalendarItem.id}
            setIsDeleteOpen={() => {
              setIsDeleteOpen(false);
              setCurrentCalendarItem(null);
            }}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default CalendarIndex;
