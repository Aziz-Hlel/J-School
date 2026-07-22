import { ApiError } from '@/api/ApiError';
import { teacherService } from '@/api/service/teachersService';
import SelectForm from '@/components/custom/SelectForm/SelectForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createTeacherRequestSchema,
  type CreateTeacherRequest,
} from '@repo/contracts/schemas/teacher/createTeacherRequest';
import { Gender } from '@repo/contracts/types/enums/enums';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const AddTeacher = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation(['teachers']);
  const queryClient = useQueryClient();
  const schoolId = useCurrentSchoolId();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['teachers', 'create'],
    mutationFn: teacherService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'], exact: false });
      form.reset();
      setDialogIsOpen(false);
    },
  });

  const form = useForm<CreateTeacherRequest>({
    resolver: zodResolver(createTeacherRequestSchema),
  });

  const onSubmit: SubmitHandler<CreateTeacherRequest> = async (data) => {
    try {
      await mutateAsync({ data, schoolId });
      toast.success(t('teachers:dialog.successToast'));
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        form.setError('email', { message: t('teachers:errors.emailConflict') });
        return;
      }
      toast.error(t('teachers:dialog.errorToast'));
    }
  };

  return (
    <Dialog onOpenChange={setDialogIsOpen} open={dialogIsOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className='flex h-[calc(100dvh-4rem)] flex-col overflow-hidden sm:max-w-120'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex h-full flex-col space-y-6'>
          <DialogHeader>
            <DialogTitle>{t('teachers:dialog.title')}</DialogTitle>
            <DialogDescription>{t('teachers:dialog.description')}</DialogDescription>
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
                      <FieldLabel htmlFor='firstName'>{t('teachers:fields.firstName')}</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? undefined}
                        id='firstName'
                        aria-invalid={fieldState.invalid}
                        placeholder={t('teachers:fields.firstNamePlaceholder')}
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
                      <FieldLabel htmlFor='lastName'>{t('teachers:fields.lastName')}</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? undefined}
                        id='lastName'
                        aria-invalid={fieldState.invalid}
                        placeholder={t('teachers:fields.lastNamePlaceholder')}
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
                      <FieldLabel htmlFor='email'>{t('teachers:fields.email')}</FieldLabel>
                      <Input
                        {...field}
                        type='email'
                        value={field.value ?? undefined}
                        id='email'
                        aria-invalid={fieldState.invalid}
                        placeholder={t('teachers:fields.emailPlaceholder')}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Gender & Role */}
                <Controller
                  name='gender'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='gender'>{t('teachers:fields.gender')}</FieldLabel>
                      <SelectForm
                        field={field}
                        options={Gender}
                        placeholder={t('teachers:fields.genderPlaceholder')}
                        label={t('teachers:fields.gender')}
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
                      <FieldLabel htmlFor='phone'>{t('teachers:fields.phone')}</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        id='phone'
                        aria-invalid={fieldState.invalid}
                        placeholder={t('teachers:fields.phonePlaceholder')}
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
                      <FieldLabel htmlFor='dateOfBirth'>{t('teachers:fields.dateOfBirth')}</FieldLabel>
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
                      <FieldLabel htmlFor='cin'>{t('teachers:fields.cin')}</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        id='cin'
                        aria-invalid={fieldState.invalid}
                        placeholder={t('teachers:fields.cinPlaceholder')}
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
                    <FieldLabel htmlFor='address'>{t('teachers:fields.address')}</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      id='address'
                      aria-invalid={fieldState.invalid}
                      placeholder={t('teachers:fields.addressPlaceholder')}
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
                    <FieldLabel htmlFor='password'>{t('teachers:fields.password')}</FieldLabel>
                    <Input
                      {...field}
                      type='password'
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      id='password'
                      aria-invalid={fieldState.invalid}
                      placeholder={t('teachers:fields.passwordPlaceholder')}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' onClick={() => setDialogIsOpen(false)}>
                {t('teachers:dialog.cancel')}
              </Button>
            </DialogClose>
            <Button type='submit' className='w-28' disabled={isPending}>
              {isPending ? <Spinner /> : <span>{t('teachers:dialog.submit')}</span>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeacher;
