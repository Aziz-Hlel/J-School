import { examSchedulesService } from '@/api/service/examService';
import queryClient from '@/config/react-qeury';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ClassroomExamScheduleResponse } from '@repo/contracts/schemas/classroom/management/ClassroomExamSchedulesResponse';
import {
  updateExamScheduleRequestSchema,
  type UpdateExamScheduleRequest,
} from '@repo/contracts/schemas/examSchedule/updateExamScheduleRequest';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { BookOpen, CalendarDays, Clock, User } from 'lucide-react';

const EditExamSchedule = ({
  classroomId,
  exam,
  setIsEditOpen,
}: {
  classroomId: string;
  exam: ClassroomExamScheduleResponse;
  setIsEditOpen: (open: boolean) => void;
}) => {
  const schoolId = useCurrentSchoolId();

  const form = useForm<UpdateExamScheduleRequest>({
    resolver: zodResolver(updateExamScheduleRequestSchema),
    defaultValues: {
      date: {
        day: exam.day ?? '',
        startTime: exam.startTime ?? '',
        endTime: exam.endTime ?? '',
      },
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['classrooms', classroomId, 'exams', 'update'],
    mutationFn: examSchedulesService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['classrooms', classroomId, 'exams'],
        exact: false,
      });
      setIsEditOpen(false);
      form.reset();
    },
  });

  const onSubmit = async (data: UpdateExamScheduleRequest) => {
    try {
      await mutateAsync({ schoolId, data, examScheduleId: exam.id });
      toast.success('Exam schedule updated');
    } catch {
      toast.error('Failed to update exam schedule');
    }
  };

  const teacherInitials = exam.teacher ? `${exam.teacher.firstName[0]}${exam.teacher.lastName[0]}` : '??';

  return (
    <Dialog open={true} onOpenChange={setIsEditOpen}>
      <DialogContent className='rounded-2xl sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-slate-800 dark:text-slate-100'>Edit Exam Schedule</DialogTitle>
          <DialogDescription>Update the date and time for this exam.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6 py-2'>
          {/* Read-only Exam Info */}
          <div className='rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50'>
            <div className='mb-3 flex items-center gap-2'>
              <BookOpen className='size-4 text-slate-500 dark:text-slate-400' />
              <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>Exam Details</span>
            </div>

            <div className='flex flex-col gap-3'>
              {/* Exam Name */}
              <div className='flex items-center justify-between'>
                <span className='text-xs text-slate-500 dark:text-slate-400'>Name</span>
                <div className='flex items-center gap-1.5'>
                  <span className='text-sm font-medium text-slate-800 dark:text-slate-100'>{exam.name.en}</span>
                  <span className='text-slate-400'>/</span>
                  <span className='text-sm text-slate-600 dark:text-slate-300'>{exam.name.ar}</span>
                </div>
              </div>

              <Separator className='opacity-50' />

              {/* Subject */}
              <div className='flex items-center justify-between'>
                <span className='text-xs text-slate-500 dark:text-slate-400'>Subject</span>
                <Badge variant='secondary' className='font-normal'>
                  {exam.subject.name.en}
                </Badge>
              </div>

              <Separator className='opacity-50' />

              {/* Teacher */}
              <div className='flex items-center justify-between'>
                <span className='text-xs text-slate-500 dark:text-slate-400'>Teacher</span>
                {exam.teacher ? (
                  <div className='flex items-center gap-2'>
                    <Avatar className='size-6'>
                      <AvatarImage src={exam.teacher.avatar?.url ?? undefined} />
                      <AvatarFallback className='text-xs'>{teacherInitials}</AvatarFallback>
                    </Avatar>
                    <span className='text-sm text-slate-800 dark:text-slate-100'>
                      {exam.teacher.firstName} {exam.teacher.lastName}
                    </span>
                  </div>
                ) : (
                  <div className='flex items-center gap-1.5 text-slate-400 dark:text-slate-500'>
                    <User className='size-4' />
                    <span className='text-sm'>Unassigned</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Editable Date & Time */}
          <FieldGroup>
            <div className='rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50'>
              <div className='mb-3 flex items-center gap-2'>
                <CalendarDays className='size-4 text-slate-500 dark:text-slate-400' />
                <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>Date &amp; Time</span>
              </div>

              <div className='flex flex-col gap-4'>
                {/* Day */}
                <Controller
                  name='date.day'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='day-input'>Day</FieldLabel>
                      <Input {...field} type='date' id='day-input' value={field.value ?? ''} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Start Time & End Time */}
                <div className='grid grid-cols-2 gap-4'>
                  <Controller
                    name='date.startTime'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='startTime-input'>
                          <span className='flex items-center gap-1'>
                            <Clock className='size-3.5 text-slate-400' />
                            Start Time
                          </span>
                        </FieldLabel>
                        <Input
                          {...field}
                          type='time'
                          id='startTime-input'
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name='date.endTime'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='endTime-input'>
                          <span className='flex items-center gap-1'>
                            <Clock className='size-3.5 text-slate-400' />
                            End Time
                          </span>
                        </FieldLabel>
                        <Input
                          {...field}
                          type='time'
                          id='endTime-input'
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
              </div>
            </div>
          </FieldGroup>

          <DialogFooter className='gap-2 pt-2 sm:gap-0'>
            <Button type='button' variant='outline' onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditExamSchedule;
