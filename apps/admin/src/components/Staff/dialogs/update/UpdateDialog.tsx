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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useSelectedRow } from '../../context/selected-row-provider';

import { staffService } from '@/api/service/staffService';
import ImageUpload from '@/components/custom/ImageUpload/comp/ImageUpload';
import SelectForm from '@/components/custom/SelectForm/SelectForm';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { updateStaffRequestSchema, type UpdateStaffRequest } from '@repo/contracts/schemas/staff/updateStaffRequest';
import { Gender } from '@repo/contracts/types/enums/enums';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const UpdateStaff = () => {
  const { t } = useTranslation(['staff']); // 2. Initialisation d'i18n
  const { handleCancel, dialogState } = useSelectedRow();
  const queryClient = useQueryClient();
  const schoolId = useCurrentSchoolId();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['staff', 'update'],
    mutationFn: staffService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'], exact: false });
      form.reset();
      handleCancel();
    },
  });

  const form = useForm<UpdateStaffRequest>({
    resolver: zodResolver(updateStaffRequestSchema),
    defaultValues:
      dialogState.openDialog === 'edit'
        ? {
            firstName: dialogState.selectedRow.firstName || '',
            lastName: dialogState.selectedRow.lastName || '',
            gender: dialogState.selectedRow.gender || Gender.MALE,
            dateOfBirth: dialogState.selectedRow.dateOfBirth,
            phone: dialogState.selectedRow.phone || null,
            cin: dialogState.selectedRow.cin || null,
            address: dialogState.selectedRow.address || null,
            avatarId: dialogState.selectedRow.avatar?.id || null,
          }
        : undefined,
  });

  const isEdit = dialogState.openDialog === 'edit';
  const selectedRow = isEdit ? dialogState.selectedRow : null;

  const onSubmit: SubmitHandler<UpdateStaffRequest> = async (data) => {
    try {
      if (isEdit && selectedRow) {
        await mutateAsync({ data, schoolId, id: selectedRow.id });
      }
      toast.success(t('staff:Edit.success_toast'));
    } catch {
      toast.error(t('staff:Edit.failed_toast'));
    }
  };

  const thumbnailErrors = [form.formState.errors.avatarId?.message];
  const clearMediaErrors = () => {
    form.clearErrors('avatarId');
  };

  const handleThumbnailUpload = (newMediaId: string | null) => {
    form.setValue('avatarId', newMediaId ?? null, newMediaId ? { shouldDirty: true, shouldValidate: true } : undefined);
  };

  return (
    <Dialog onOpenChange={handleCancel} open={dialogState.openDialog === 'edit'}>
      <DialogContent className='flex h-[calc(100dvh-4rem)] flex-col overflow-hidden sm:max-w-120'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex h-full flex-col space-y-6'>
          <DialogHeader>
            <DialogTitle>{t('staff:Edit.edit_title')}</DialogTitle>
            <DialogDescription>{t('staff:Edit.edit_description')}</DialogDescription>
          </DialogHeader>
          <div className='min-h-0 flex-1 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent overflow-y-auto overscroll-contain pr-2 pb-6 hover:scrollbar-thumb-neutral-400'>
            <FieldGroup>
              {/* First Name & Last Name */}
              <ImageUpload
                initMedia={selectedRow?.avatar ?? null}
                mediaErrors={thumbnailErrors}
                clearMediaErrors={clearMediaErrors}
                handleMediaUpload={handleThumbnailUpload}
              />
              <div className='grid grid-cols-2 gap-4'>
                <Controller
                  name='firstName'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='firstName'>{t('staff:Edit.fields.first_name')}</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? undefined}
                        id='firstName'
                        aria-invalid={fieldState.invalid}
                        placeholder={t('staff:Edit.fields.first_name')}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name='lastName'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='lastName'>{t('staff:Edit.fields.last_name')}</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? undefined}
                        id='lastName'
                        aria-invalid={fieldState.invalid}
                        placeholder={t('staff:Edit.fields.last_name')}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              {/* Gender */}
              <div className='grid grid-cols-2 gap-4'>
                <Controller
                  name='gender'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='gender'>{t('staff:Edit.fields.gender')}</FieldLabel>
                      <SelectForm
                        field={field}
                        options={Gender}
                        placeholder={t('staff:Edit.fields.gender_placeholder')}
                        label={t('staff:Edit.fields.gender')}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name='phone'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='phone'>{t('staff:Edit.fields.phone')}</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        id='phone'
                        aria-invalid={fieldState.invalid}
                        placeholder={t('staff:Edit.fields.phone_placeholder')}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              {/* Date of Birth & CIN */}
              <div className='grid grid-cols-2 gap-4'>
                <Controller
                  name='dateOfBirth'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='dateOfBirth'>{t('staff:Edit.fields.date_of_birth')}</FieldLabel>
                      <Input
                        type='date'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        id='dateOfBirth'
                        aria-invalid={fieldState.invalid}
                        placeholder='YYYY-MM-DD'
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name='cin'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='cin'>{t('staff:Edit.fields.cin')}</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        id='cin'
                        aria-invalid={fieldState.invalid}
                        placeholder={t('staff:Edit.fields.cin')}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              {/* Address */}
              <Controller
                name='address'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='address'>{t('staff:Edit.fields.address')}</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      id='address'
                      aria-invalid={fieldState.invalid}
                      placeholder={t('staff:Edit.fields.address')}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' onClick={handleCancel}>
                {t('staff:Edit.actions.cancel')}
              </Button>
            </DialogClose>
            <Button type='submit' className='w-28' disabled={isPending}>
              {isPending ? <Spinner /> : <span>{t('staff:Edit.actions.save')}</span>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStaff;
