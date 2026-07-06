import { calendarService } from '@/api/service/calendarService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import queryClient from '@/config/react-qeury';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCalendarReqSchema, type CreateCalendarReq } from '@repo/contracts/schemas/Calendar/create';
import { useMutation } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const CALENDAR_SESSION_TYPES = ['PUBLIC_HOLIDAY', 'SCHOOL_HOLIDAY', 'TRIP', 'EVENT', 'OTHER'] as const;

const AddCalendar = ({ children }: { children: ReactNode }) => {
  const schoolId = useCurrentSchoolId();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CreateCalendarReq>({
    resolver: zodResolver(createCalendarReqSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'EVENT',
      startDate: '',
      startTime: null,
      endDate: '',
      endTime: null,
      sendNotification: false,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['calendar', 'create'],
    mutationFn: (payload: CreateCalendarReq) => calendarService.createCalendar(schoolId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['calendar'],
        exact: false,
      });
      setIsOpen(false);
      form.reset();
    },
  });

  const onSubmit = async (data: CreateCalendarReq) => {
    try {
      await mutateAsync(data);
      toast.success('Calendar added successfully');
    } catch {
      toast.error('Failed to add calendar');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='rounded-2xl sm:max-w-106.25'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-slate-800 dark:text-slate-100'>Add calendar</DialogTitle>
          <DialogDescription>Add a new calendar for this school.</DialogDescription>
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

            {/* Send Notification */}
            <Controller
              name='sendNotification'
              control={form.control}
              render={({ field }) => (
                <Field
                  orientation='horizontal'
                  className='flex items-center justify-between rounded-lg border p-3 shadow-sm'
                >
                  <div className='space-y-0.5'>
                    <FieldLabel htmlFor='sendNotification-input' className='text-sm font-medium'>
                      Send Notification
                    </FieldLabel>
                    <p className='text-xs text-slate-500 dark:text-slate-400'>
                      Notify parents and staff about this event.
                    </p>
                  </div>
                  <input
                    type='checkbox'
                    id='sendNotification-input'
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className='h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500'
                  />
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className='gap-2 pt-4 sm:gap-0'>
            <Button type='button' variant='outline' onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Saving...' : 'Add Calendar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCalendar;
