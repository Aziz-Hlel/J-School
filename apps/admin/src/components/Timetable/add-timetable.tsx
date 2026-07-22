import { classroomsService } from '@/api/service/classroomsService';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import queryClient from '@/config/react-qeury';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createClassroomTimetableReqSchema,
  type CreateClassroomTimetableReq,
} from '@repo/contracts/schemas/classroom/timeTable/createTimetableRequest2';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CalendarDays, DoorClosed, Plus } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const DAYS = [
  { labelKey: 'timetable:days.monday', value: 'MONDAY' },
  { labelKey: 'timetable:days.tuesday', value: 'TUESDAY' },
  { labelKey: 'timetable:days.wednesday', value: 'WEDNESDAY' },
  { labelKey: 'timetable:days.thursday', value: 'THURSDAY' },
  { labelKey: 'timetable:days.friday', value: 'FRIDAY' },
  { labelKey: 'timetable:days.saturday', value: 'SATURDAY' },
  { labelKey: 'timetable:days.sunday', value: 'SUNDAY' },
] as const;

const AddTimetable = ({ classroomId, setIsOpen }: { classroomId: string; setIsOpen: (value: boolean) => void }) => {
  const { t, i18n } = useTranslation(['timetable']);
  const schoolId = useCurrentSchoolId();

  const { data: assignmentsData } = useQuery({
    queryKey: ['classrooms', classroomId, 'subjects'],
    queryFn: async () => (classroomId ? await classroomsService.subjects({ schoolId, classroomId }) : undefined),
    enabled: Boolean(classroomId),
  });

  const subjects = assignmentsData?.data ?? [];

  const form = useForm<CreateClassroomTimetableReq>({
    resolver: zodResolver(createClassroomTimetableReqSchema),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['classrooms', classroomId, 'timetable', 'create'],
    mutationFn: classroomsService.createTimetable,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['classrooms', classroomId, 'timetable'],
        exact: false,
      });
      setIsOpen(false);
      form.reset();
    },
  });

  const onSubmit = async (data: CreateClassroomTimetableReq) => {
    try {
      await mutateAsync({ schoolId, classroomId, data });
      toast.success(t('timetable:messages.success'));
    } catch {
      toast.error(t('timetable:messages.error'));
    }
  };

  return (
    <Dialog open onOpenChange={setIsOpen}>
      <DialogContent className='rounded-2xl sm:max-w-106.25'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-slate-800 dark:text-slate-100'>
            {t('timetable:addModal.title')}
          </DialogTitle>
          <DialogDescription>{t('timetable:addModal.description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
          {/* Subject */}
          <Field>
            <FieldLabel className='text-xs font-semibold tracking-wide text-slate-500 uppercase'>
              {t('timetable:fields.subject.label')}
            </FieldLabel>
            <Controller
              control={control}
              name='subjectId'
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='h-10 rounded-xl border-slate-200 bg-slate-50'>
                    <SelectValue placeholder={t('timetable:fields.subject.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name[i18n.language as keyof typeof s.name] || s.name.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.subjectId && <FieldError>{errors.subjectId.message}</FieldError>}
          </Field>

          {/* Day */}
          <Field>
            <FieldLabel className='flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-500 uppercase'>
              <CalendarDays className='h-3.5 w-3.5' />
              {t('timetable:fields.day.label')}
            </FieldLabel>
            <Controller
              control={control}
              name='day'
              render={({ field }) => (
                <div className='grid grid-cols-7 gap-1.5'>
                  {DAYS.map(({ labelKey, value }) => (
                    <button
                      key={value}
                      type='button'
                      onClick={() => field.onChange(value)}
                      className={cn(
                        'rounded-lg border-[1.5px] py-2 text-[11px] font-semibold transition-all duration-150',
                        field.value === value
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                          : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600',
                      )}
                    >
                      {t(labelKey)}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.day && <FieldError>{errors.day.message}</FieldError>}
          </Field>

          {/* Time range */}
          <div className='grid grid-cols-[1fr_auto_1fr] items-end gap-2'>
            <Field>
              <FieldLabel className='text-xs font-semibold tracking-wide text-slate-500 uppercase'>
                {t('timetable:fields.startTime.label')}
              </FieldLabel>
              <Input
                type='time'
                {...register('startTime')}
                className='h-10 rounded-xl border-slate-200 bg-slate-50 text-sm'
              />
              {errors.startTime && <FieldError>{errors.startTime.message}</FieldError>}
            </Field>

            <span className='pb-2.5 text-sm font-medium text-slate-400 select-none'>→</span>

            <Field>
              <FieldLabel className='text-xs font-semibold tracking-wide text-slate-500 uppercase'>
                {t('timetable:fields.endTime.label')}
              </FieldLabel>
              <Input
                type='time'
                {...register('endTime')}
                className='h-10 rounded-xl border-slate-200 bg-slate-50 text-sm'
              />
              {errors.endTime && <FieldError>{errors.endTime.message}</FieldError>}
            </Field>
          </div>

          {/* Room (optional) */}
          <Field>
            <FieldLabel className='text-xs font-semibold tracking-wide text-slate-500 uppercase'>
              {t('timetable:fields.room.label')}{' '}
              <span className='ml-1 text-[11px] font-normal tracking-normal text-slate-400 normal-case'>
                {t('timetable:fields.room.optional')}
              </span>
            </FieldLabel>
            <div className='relative'>
              <DoorClosed className='pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400' />
              <Input
                {...register('room')}
                placeholder={t('timetable:fields.room.placeholder')}
                className='h-10 rounded-xl border-slate-200 bg-slate-50 pl-9 text-sm'
              />
            </div>
          </Field>

          {/* Footer */}
          <div className='mt-1 flex justify-end gap-2 border-t border-slate-100 pt-1'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsOpen(false)}
              className='rounded-xl text-slate-600'
            >
              {t('timetable:actions.cancel')}
            </Button>
            <Button
              type='submit'
              disabled={isPending}
              className='gap-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700'
            >
              <Plus className='h-4 w-4' />
              {isPending ? t('timetable:actions.adding') : t('timetable:actions.addSlot')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTimetable;
