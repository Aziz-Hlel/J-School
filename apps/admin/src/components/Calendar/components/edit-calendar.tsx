import { calendarService } from '@/api/service/calendarService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import queryClient from '@/config/react-qeury';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CalendarResponse } from '@repo/contracts/schemas/Calendar/response';
import { updateCalendarReqSchema, type UpdateCalendarReq } from '@repo/contracts/schemas/Calendar/update';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const CALENDAR_SESSION_TYPES = ['PUBLIC_HOLIDAY', 'SCHOOL_HOLIDAY', 'TRIP', 'EVENT', 'OTHER'] as const;

const EditCalendar = ({
  calendar,
  open,
  onOpenChange,
}: {
  calendar: CalendarResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const schoolId = useCurrentSchoolId();

  const form = useForm<UpdateCalendarReq>({
    resolver: zodResolver(updateCalendarReqSchema),
    defaultValues: {
      description: calendar.description,
      endDate: calendar.endDate,
      endTime: calendar.endTime,
      startDate: calendar.startDate,
      startTime: calendar.startTime,
      title: calendar.title,
      type: calendar.type,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['calendar', 'edit', calendar.id],
    mutationFn: (payload: UpdateCalendarReq) => calendarService.updateCalendar(schoolId, calendar.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['calendar'],
        exact: false,
      });
      onOpenChange(false);
      form.reset();
    },
  });

  const onSubmit = async (data: UpdateCalendarReq) => {
    try {
      await mutateAsync(data);
      toast.success('Calendar updated successfully');
    } catch {
      toast.error('Failed to update calendar');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='rounded-2xl sm:max-w-106.25'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-slate-800 dark:text-slate-100'>Edit calendar</DialogTitle>
          <DialogDescription>Edit the calendar for this school.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6 py-4'>
          <FieldGroup>
            {/* Title */}
            <Controller
              name='title'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='title-input'>Title</FieldLabel>
                  <Input {...field} id='title-input' placeholder='Calendar event title' />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Description */}
            <Controller
              name='description'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='description-input'>Description</FieldLabel>
                  <Textarea {...field} value={field.value ?? ''} id='description-input' placeholder='Description' />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Type */}
            <Controller
              name='type'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='type-input'>Type</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id='type-input'>
                      <SelectValue placeholder='Select event type' />
                    </SelectTrigger>
                    <SelectContent>
                      {CALENDAR_SESSION_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Start Date & End Date */}
            <div className='grid grid-cols-2 gap-4'>
              <Controller
                name='startDate'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='startDate-input'>Start Date</FieldLabel>
                    <Input {...field} type='date' id='startDate-input' />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name='endDate'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='endDate-input'>End Date</FieldLabel>
                    <Input {...field} type='date' id='endDate-input' />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            {/* Start Time & End Time */}
            <div className='grid grid-cols-2 gap-4'>
              <Controller
                name='startTime'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='startTime-input'>Start Time</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      type='time'
                      id='startTime-input'
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name='endTime'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='endTime-input'>End Time</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      type='time'
                      id='endTime-input'
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>

          <DialogFooter className='gap-2 pt-4 sm:gap-0'>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
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

export default EditCalendar;
