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

import SelectForm from '@/components/custom/SelectForm/SelectForm';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { Gender } from '@repo/contracts/types/enums/enums';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { TableData } from '../../core/core';
import { operations, type schemasType } from '../../core/services';

const CreateDialog = () => {
  const { t } = useTranslation(['parents']);
  const { handleCancel, dialogState } = useSelectedRow();
  const queryClient = useQueryClient();
  const schoolId = useCurrentSchoolId();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: [TableData.MODULE_NAME, 'create'],
    mutationFn: operations.create.fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TableData.MODULE_NAME], exact: false });
      form.reset();
      handleCancel();
    },
  });

  const defaultValues = operations.create.defaultValues({});

  const form = useForm<schemasType['create']>({
    resolver: zodResolver(operations.create.schema),
    defaultValues: defaultValues,
  });

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      handleCancel();
    }
  };

  const onSubmit: SubmitHandler['create'] = async (data: any) => {
    try {
      await mutateAsync({ data, schoolId });
      toast.success(t('parents:createDialog.successToast', { module: TableData.ModuleName }));
    } catch {
      toast.error(t('parents:createDialog.errorToast', { module: TableData.ModuleName }));
    }
  };

  const dialogIsOpen = dialogState.openDialog === 'add';

  return (
    <Dialog onOpenChange={onOpenChange} open={dialogIsOpen}>
      <DialogContent className='flex h-[calc(100dvh-4rem)] flex-col overflow-hidden sm:max-w-120'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex h-full flex-col space-y-6'>
          <DialogHeader>
            <DialogTitle>{t('parents:createDialog.title')}</DialogTitle>
            <DialogDescription>{t('parents:createDialog.description')}</DialogDescription>
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
                      <FieldLabel htmlFor='firstName'>{t('parents:fields.firstName')}</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? undefined}
                        id='firstName'
                        aria-invalid={fieldState.invalid}
                        placeholder={t('parents:fields.firstNamePlaceholder')}
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
                      <FieldLabel htmlFor='lastName'>{t('parents:fields.lastName')}</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? undefined}
                        id='lastName'
                        aria-invalid={fieldState.invalid}
                        placeholder={t('parents:fields.lastNamePlaceholder')}
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
                      <FieldLabel htmlFor='gender'>{t('parents:fields.gender')}</FieldLabel>
                      <SelectForm
                        field={field}
                        options={Gender}
                        placeholder={t('parents:fields.genderPlaceholder')}
                        label={t('parents:fields.gender')}
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
                      <FieldLabel htmlFor='email'>{t('parents:fields.email')}</FieldLabel>
                      <Input
                        {...field}
                        type='email'
                        value={field.value ?? undefined}
                        id='email'
                        aria-invalid={fieldState.invalid}
                        placeholder={t('parents:fields.emailPlaceholder')}
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
                      <FieldLabel htmlFor='phone'>{t('parents:fields.phone')}</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        id='phone'
                        aria-invalid={fieldState.invalid}
                        placeholder={t('parents:fields.phonePlaceholder')}
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
                      <FieldLabel htmlFor='dateOfBirth'>{t('parents:fields.dateOfBirth')}</FieldLabel>
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
                      <FieldLabel htmlFor='cin'>{t('parents:fields.cin')}</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        id='cin'
                        aria-invalid={fieldState.invalid}
                        placeholder={t('parents:fields.cinPlaceholder')}
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
                    <FieldLabel htmlFor='address'>{t('parents:fields.address')}</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      id='address'
                      aria-invalid={fieldState.invalid}
                      placeholder={t('parents:fields.addressPlaceholder')}
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
                    <FieldLabel htmlFor='password'>{t('parents:fields.password')}</FieldLabel>
                    <Input
                      {...field}
                      type='password'
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      id='password'
                      aria-invalid={fieldState.invalid}
                      placeholder={t('parents:fields.passwordPlaceholder')}
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
                {t('parents:createDialog.cancel')}
              </Button>
            </DialogClose>
            <Button type='submit' className='w-28' disabled={isPending}>
              {isPending ? <Spinner /> : <span>{t('parents:createDialog.submit')}</span>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
