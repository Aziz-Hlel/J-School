import { classroomsService } from '@/api/service/classroomsService';
import { examSchedulesService } from '@/api/service/examService';
import queryClient from '@/config/react-qeury';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ClassroomExamScheduleResponse } from '@repo/contracts/schemas/classroom/management/ClassroomExamSchedulesResponse';
import {
  createExamScheduleRequestSchema,
  type CreateExamScheduleRequest,
} from '@repo/contracts/schemas/examSchedule/createExamScheduleRequest';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Clock } from 'lucide-react';

const AddScheduleExam = ({
  classroomId,
  setIsOpen,
  examsSchedules,
}: {
  classroomId: string;
  setIsOpen: (open: boolean) => void;
  examsSchedules: ClassroomExamScheduleResponse[];
}) => {
  const schoolId = useCurrentSchoolId();

  const { data: allExamsData } = useQuery({
    queryKey: ['classrooms', classroomId, 'subjects'],
    queryFn: async () => classroomsService.exams.select({ schoolId, classroomId }),
    enabled: Boolean(classroomId),
  });

  const allExams = allExamsData?.data ?? [];

  const availableExams = allExams.filter((exam) => {
    return !examsSchedules.some((schedule) => schedule.examId === exam.id);
  });

  const form = useForm<CreateExamScheduleRequest>({
    resolver: zodResolver(createExamScheduleRequestSchema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['classrooms', classroomId, 'exams', 'create'],
    mutationFn: examSchedulesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['classrooms', classroomId, 'exams'],
        exact: false,
      });
      setIsOpen(false);
      form.reset();
    },
  });

  const onSubmit = async (data: CreateExamScheduleRequest) => {
    try {
      await mutateAsync({ schoolId, data });
      toast.success('Exam schedule added');
    } catch {
      toast.error('Failed to add exam schedule');
    }
  };
  console.log(form.formState.errors);

  return (
    <Dialog open={true} onOpenChange={setIsOpen}>
      <DialogContent className='rounded-2xl sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-slate-800 dark:text-slate-100'>Schedule Exam</DialogTitle>
          <DialogDescription>Assign an exam to a specific day and time slot.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6 py-2'>
          <FieldGroup>
            {/* Exam Selection */}
            <Controller
              name='examId'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='examId-input'>Exam</FieldLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const exam = availableExams.find((exam) => exam.id === value);
                      if (exam) {
                        form.setValue('assignmentId', exam.assignmentId);
                      }
                    }}
                    value={field.value}
                  >
                    <SelectTrigger id='examId-input'>
                      <SelectValue placeholder='Select an exam' />
                    </SelectTrigger>
                    <SelectContent>
                      {availableExams.length === 0 ? (
                        <SelectItem value='__none__' disabled>
                          No exams available
                        </SelectItem>
                      ) : (
                        availableExams.map((exam) => (
                          <SelectItem key={exam.id} value={exam.id}>
                            {exam.name.en}/{exam.name.ar}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Schedule Date */}
            <div className='rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50'>
              <div className='mb-3 flex items-center gap-2'>
                <CalendarDays data-icon='inline-start' className='size-4 text-slate-500 dark:text-slate-400' />
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
                            <Clock data-icon='inline-start' className='size-3.5 text-slate-400' />
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
                            <Clock data-icon='inline-start' className='size-3.5 text-slate-400' />
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
            <Button type='button' variant='outline' onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Saving...' : 'Schedule Exam'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddScheduleExam;
