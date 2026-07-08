import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useSelectedRow } from '../../context/selected-row-provider';

import { extraCurricularService } from '@/api/service/extracurricularsService';
import schoolService from '@/api/service/schoolService';
import SelectForm from '@/components/custom/SelectForm/SelectForm';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import {
  updateExtraCurricularReqSchema,
  type UpdateExtraCurricularReq,
} from '@repo/contracts/schemas/extraCurricular/updateExtraCurricularReq';
import { DayOfWeek, SessionType } from '@repo/contracts/types/enums/enums';
import { toast } from 'sonner';
import { TableData } from '../../core/core';

const UpdateDialog = () => {
  const { handleCancel, dialogState } = useSelectedRow();
  const queryClient = useQueryClient();
  const schoolId = useCurrentSchoolId();

  const isEdit = dialogState.openDialog === 'edit';
  const selectedRow = isEdit ? dialogState.selectedRow : null;

  const { data: teachersData } = useQuery({
    queryKey: ['teachers', 'select', schoolId],
    queryFn: () => schoolService.selectTeachers({ schoolId }),
    enabled: isEdit,
  });
  const teachers = teachersData?.items ?? [];

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['extracurriculars', 'update'],
    mutationFn: extraCurricularService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TableData.MODULE_NAME], exact: false });
      form.reset();
      handleCancel();
    },
  });

  const form = useForm<UpdateExtraCurricularReq>({
    resolver: zodResolver(updateExtraCurricularReqSchema),
    shouldUnregister: true,
    defaultValues: {
      title: {
        en: '',
        fr: '',
        ar: '',
      },
      type: SessionType.WEEKLY,
      dayOfWeek: DayOfWeek.MONDAY,
      startTime: '',
      endTime: null,
      teacherId: null,
    },
  });

  useEffect(() => {
    if (!selectedRow) {
      return;
    }

    const baseValues = {
      title: {
        en: selectedRow.title?.en ?? '',
        fr: selectedRow.title?.fr ?? '',
        ar: selectedRow.title?.ar ?? '',
      },
      type: selectedRow.session.type ?? SessionType.WEEKLY,
      startTime: selectedRow.session.startTime ?? '',
      endTime: selectedRow.session.endTime ?? null,
      teacherId: selectedRow.teacher?.id ?? null,
    };

    form.reset(
      selectedRow.session.type === SessionType.SPECIAL
        ? {
            ...baseValues,
            type: SessionType.SPECIAL,
            date: selectedRow.session.date ?? '',
          }
        : {
            ...baseValues,
            type: SessionType.WEEKLY,
            dayOfWeek: selectedRow.session.day ?? DayOfWeek.MONDAY,
          },
    );
  }, [form, selectedRow]);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      handleCancel();
    }
  };

  const onSubmit: SubmitHandler<UpdateExtraCurricularReq> = async (data) => {
    try {
      if (isEdit && selectedRow) {
        await mutateAsync({ data, schoolId, id: selectedRow.id });
        toast.success('Extracurricular updated successfully');
      }
    } catch {
      toast.error('Failed to update extracurricular');
    }
  };

  const sessionType = form.watch('type');

  return (
    <Dialog onOpenChange={onOpenChange} open={isEdit}>
      <DialogContent className='flex h-[calc(100dvh-4rem)] flex-col overflow-hidden sm:max-w-120'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex h-full flex-col space-y-6'>
          <DialogHeader>
            <DialogTitle>Edit extracurricular</DialogTitle>
            <DialogDescription>Update the details of the extracurricular session</DialogDescription>
          </DialogHeader>
          <div className='min-h-0 flex-1 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent overflow-y-auto overscroll-contain pr-2 pb-6 hover:scrollbar-thumb-neutral-400'>
            <FieldGroup>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <Controller
                  name='title.en'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='title-en'>Title (EN)</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        id='title-en'
                        aria-invalid={fieldState.invalid}
                        placeholder='English title'
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name='title.fr'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='title-fr'>Title (FR)</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        id='title-fr'
                        aria-invalid={fieldState.invalid}
                        placeholder='French title'
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name='title.ar'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='title-ar'>Title (AR)</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        id='title-ar'
                        aria-invalid={fieldState.invalid}
                        placeholder='Arabic title'
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Controller
                  name='type'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='type'>Session type</FieldLabel>
                      <SelectForm field={field} options={SessionType} placeholder='Select type' label='Session type' />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name='teacherId'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='teacherId'>Teacher</FieldLabel>
                      <Select
                        value={field.value ?? 'none'}
                        onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
                      >
                        <SelectTrigger id='teacherId'>
                          <SelectValue placeholder='Select teacher' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='none'>No teacher</SelectItem>
                          {teachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.firstName} {teacher.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Controller
                  name='startTime'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='startTime'>Start time</FieldLabel>
                      <Input
                        {...field}
                        type='time'
                        value={field.value ?? ''}
                        id='startTime'
                        aria-invalid={fieldState.invalid}
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
                      <FieldLabel htmlFor='endTime'>End time</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        type='time'
                        id='endTime'
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              {sessionType === SessionType.WEEKLY ? (
                <Controller
                  name='dayOfWeek'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='dayOfWeek'>Day of week</FieldLabel>
                      <SelectForm field={field} options={DayOfWeek} placeholder='Select day' label='Day of week' />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              ) : (
                <Controller
                  name='date'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='date'>Date</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        type='date'
                        id='date'
                        aria-invalid={fieldState.invalid}
                        placeholder='YYYY-MM-DD'
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              )}
            </FieldGroup>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' onClick={handleCancel}>
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit' className='w-28' disabled={isPending}>
              {isPending ? <Spinner /> : <span>Save changes</span>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDialog;
