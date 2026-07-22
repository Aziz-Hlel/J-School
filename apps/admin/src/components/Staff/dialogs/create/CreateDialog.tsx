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
import { useTranslation } from 'react-i18next'; // 1. Import du hook i18n
import { useSelectedRow } from '../../context/selected-row-provider';

import { ApiError } from '@/api/ApiError';
import { staffService } from '@/api/service/staffService';
import SelectForm from '@/components/custom/SelectForm/SelectForm';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { createStaffRequestSchema, type CreateStaffRequest } from '@repo/contracts/schemas/staff/createStaffRequest';
import { Gender } from '@repo/contracts/types/enums/enums';
import { staffRoles } from '@repo/contracts/types/enums/meta/userRoleMeta';
import { toast } from 'sonner';

const CreateDialog = () => {
  const { t } = useTranslation(['staff', 'enums']); // 2. Initialisation
  const { handleCancel, dialogState } = useSelectedRow();
  const queryClient = useQueryClient();
  const schoolId = useCurrentSchoolId();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['staff', 'create'],
    mutationFn: staffService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'], exact: false });
      form.reset();
      handleCancel();
    },
  });

  const form = useForm<CreateStaffRequest>({
    resolver: zodResolver(createStaffRequestSchema),
  });

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      handleCancel();
    }
  };

  const onSubmit: SubmitHandler<CreateStaffRequest> = async (data) => {
    try {
      await mutateAsync({ data, schoolId });
      toast.success(t('staff:create.success_toast'));
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        form.setError('email', { message: t('staff:create.errors.email_exists') });
        return;
      }
      toast.error(t('staff:create.failed_toast'));
    }
  };

  const dialogIsOpen = dialogState.openDialog === 'add';

  return (
    <Dialog onOpenChange={onOpenChange} open={dialogIsOpen}>
      <DialogContent className='flex h-[calc(100dvh-4rem)] flex-col overflow-hidden sm:max-w-120'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex h-full flex-col space-y-6'>
          <DialogHeader>
            <DialogTitle>{t('staff:create.create_title')}</DialogTitle>
            <DialogDescription>{t('staff:create.create_description')}</DialogDescription>
          </DialogHeader>
          <div className='min-h-0 flex-1 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent overflow-y-auto overscroll-contain pr-2 pb-6 hover:scrollbar-thumb-neutral-400'>
            <FieldGroup>
              {/* First Name & Last Name */}
              <div className='grid grid-cols-2 gap-4'>
                <Controller
                  name='firstName'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='firstName'>{t('staff:create.fields.first_name')}</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? undefined}
                        id='firstName'
                        aria-invalid={fieldState.invalid}
                        placeholder={t('staff:create.fields.first_name')}
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
                      <FieldLabel htmlFor='lastName'>{t('staff:create.fields.last_name')}</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? undefined}
                        id='lastName'
                        aria-invalid={fieldState.invalid}
                        placeholder={t('staff:create.fields.last_name')}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              {/* Gender & Role */}
              <div className='grid grid-cols-2 gap-4'>
                <Controller
                  name='gender'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='gender'>{t('staff:create.fields.gender')}</FieldLabel>
                      <SelectForm
                        field={field}
                        options={Gender}
                        placeholder={t('staff:create.fields.gender_placeholder')}
                        label={t('staff:create.fields.gender')}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name='role'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='role'>{t('staff:create.fields.role')}</FieldLabel>
                      <SelectForm
                        field={field}
                        options={staffRoles}
                        placeholder={t('staff:create.fields.role_placeholder')}
                        label={t('staff:create.fields.role')}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              {/* Email & Phone */}
              <div className='grid grid-cols-2 gap-4'>
                <Controller
                  name='email'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='email'>{t('staff:create.fields.email')}</FieldLabel>
                      <Input
                        {...field}
                        type='email'
                        value={field.value ?? undefined}
                        id='email'
                        aria-invalid={fieldState.invalid}
                        placeholder={t('staff:create.fields.email_placeholder')}
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
                      <FieldLabel htmlFor='phone'>{t('staff:create.fields.phone')}</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        id='phone'
                        aria-invalid={fieldState.invalid}
                        placeholder={t('staff:create.fields.phone_placeholder')}
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
                      <FieldLabel htmlFor='dateOfBirth'>{t('staff:create.fields.dob')}</FieldLabel>
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
                      <FieldLabel htmlFor='cin'>{t('staff:create.fields.cin')}</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        id='cin'
                        aria-invalid={fieldState.invalid}
                        placeholder={t('staff:create.fields.cin')}
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
                    <FieldLabel htmlFor='address'>{t('staff:create.fields.address')}</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      id='address'
                      aria-invalid={fieldState.invalid}
                      placeholder={t('staff:create.fields.address')}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Password */}
              <Controller
                name='password'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='password'>{t('staff:create.fields.password')}</FieldLabel>
                    <Input
                      {...field}
                      type='password'
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      id='password'
                      aria-invalid={fieldState.invalid}
                      placeholder={t('staff:create.fields.password')}
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
                {t('staff:create.actions.cancel')}
              </Button>
            </DialogClose>
            <Button type='submit' className='w-28' disabled={isPending}>
              {isPending ? <Spinner /> : <span>{t('staff:create.actions.submit')}</span>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
