import { studentService } from '@/api/service/studentService';
import ImageUpload from '@/components/custom/ImageUpload/comp/ImageUpload';
import SelectForm from '@/components/custom/SelectForm/SelectForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import queryClient from '@/config/react-qeury';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createStudentRequestSchema,
  type CreateStudentReq,
} from '@repo/contracts/schemas/student/createStudentRequest';
import { Gender, StudentStatus } from '@repo/contracts/types/enums/enums';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const AddStudent = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation(['studentProfile']);
  const schoolId = useCurrentSchoolId();
  const [open, setOpen] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['students', 'create'],
    mutationFn: (payload: CreateStudentReq) => studentService.create(schoolId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'], exact: false });
      setOpen(false);
    },
  });

  const defaultValues: CreateStudentReq = {
    uid: '',
    dateOfBirth: null,
    gender: Gender.MALE,
    status: StudentStatus.ACTIVE,
    firstName: {
      en: '',
      ar: '',
    },
    lastName: {
      en: '',
      ar: '',
    },
    avatarId: null,
  };

  const form = useForm<CreateStudentReq>({
    resolver: zodResolver(createStudentRequestSchema),
    defaultValues: defaultValues,
  });

  const handleCreateStudent = async (data: CreateStudentReq) => {
    try {
      await mutateAsync(data);
      toast.success(t('studentProfile:addForm.notifications.success'));
    } catch {
      toast.error(t('studentProfile:addForm.notifications.error'));
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
    <>
      {/* ======================================================== */}
      {/* DIALOG 1: ADD STUDENT INFO */}
      {/* ======================================================== */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent className='flex h-[calc(100dvh-4rem)] flex-col overflow-hidden rounded-2xl sm:max-w-120'>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold text-slate-800 dark:text-slate-100'>
              {t('studentProfile:addForm.title')}
            </DialogTitle>
            <DialogDescription>{t('studentProfile:addForm.description')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleCreateStudent)} className='flex min-h-0 flex-1 flex-col'>
            <div className='min-h-0 flex-1 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent overflow-y-auto overscroll-contain pr-2 pb-6 hover:scrollbar-thumb-neutral-400'>
              <FieldGroup>
                <ImageUpload
                  initMedia={null}
                  mediaErrors={thumbnailErrors}
                  clearMediaErrors={clearMediaErrors}
                  handleMediaUpload={handleThumbnailUpload}
                />

                {/* First & Last Name */}
                <div className='grid grid-cols-2 gap-4'>
                  {/* First Name EN */}
                  <Controller
                    name='firstName.en'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='firstNameEn'>{t('studentProfile:addForm.fields.firstNameEn')}</FieldLabel>
                        <Input
                          {...field}
                          value={field.value ?? undefined}
                          id='firstNameEn'
                          aria-invalid={fieldState.invalid}
                          placeholder={t('studentProfile:addForm.placeholders.firstNameEn')}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  {/* First Name AR */}
                  <Controller
                    name='firstName.ar'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='firstNameAr'>{t('studentProfile:addForm.fields.firstNameAr')}</FieldLabel>
                        <Input
                          {...field}
                          value={field.value ?? undefined}
                          id='firstNameAr'
                          aria-invalid={fieldState.invalid}
                          placeholder={t('studentProfile:addForm.placeholders.firstNameAr')}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  {/* Last Name EN */}
                  <Controller
                    name='lastName.en'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='lastNameEn'>{t('studentProfile:addForm.fields.lastNameEn')}</FieldLabel>
                        <Input
                          {...field}
                          value={field.value ?? undefined}
                          id='lastNameEn'
                          aria-invalid={fieldState.invalid}
                          placeholder={t('studentProfile:addForm.placeholders.lastNameEn')}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  {/* Last Name AR */}
                  <Controller
                    name='lastName.ar'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='lastNameAr'>{t('studentProfile:addForm.fields.lastNameAr')}</FieldLabel>
                        <Input
                          {...field}
                          value={field.value ?? undefined}
                          id='lastNameAr'
                          aria-invalid={fieldState.invalid}
                          placeholder={t('studentProfile:addForm.placeholders.lastNameAr')}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>

                {/* UID */}
                <Controller
                  name='uid'
                  control={form.control}
                  render={({ field }) => (
                    <Field data-invalid={false}>
                      <FieldLabel htmlFor='uid'>{t('studentProfile:uid')}</FieldLabel>
                      <Input {...field} value={field.value ?? undefined} id='uid' className='bg-muted/30' />
                    </Field>
                  )}
                />

                {/* Date of Birth */}
                <Controller
                  name='dateOfBirth'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='dateOfBirth'>{t('studentProfile:addForm.fields.dateOfBirth')}</FieldLabel>
                      <Input
                        type='date'
                        {...field}
                        value={field.value ?? undefined}
                        onChange={(e) => field.onChange(e.target.value ?? null)}
                        id='dateOfBirth'
                        aria-invalid={fieldState.invalid}
                        placeholder='YYYY-MM-DD'
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Gender */}
                <Controller
                  name='gender'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className='flex'>
                      <FieldLabel htmlFor='gender-input'>{t('studentProfile:addForm.fields.gender')}</FieldLabel>
                      <SelectForm
                        field={field}
                        options={Gender}
                        placeholder={t('studentProfile:addForm.placeholders.gender')}
                        label={t('studentProfile:addForm.fields.gender')}
                      />
                    </Field>
                  )}
                />

                {/* Status */}
                <Controller
                  name='status'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className='flex'>
                      <FieldLabel htmlFor='status-input'>{t('studentProfile:addForm.fields.status')}</FieldLabel>
                      <SelectForm
                        field={field}
                        options={StudentStatus}
                        placeholder={t('studentProfile:addForm.placeholders.status')}
                        label={t('studentProfile:addForm.fields.status')}
                      />
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>

            <DialogFooter className='gap-2 sm:gap-0'>
              <Button
                type='button'
                variant='outline'
                className='rounded-xl border-slate-200 dark:border-zinc-800'
                onClick={() => setOpen(false)}
              >
                {t('studentProfile:addForm.actions.cancel')}
              </Button>
              <Button type='submit' className='bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl'>
                {isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    {t('studentProfile:addForm.actions.creating')}
                  </>
                ) : (
                  t('studentProfile:addForm.actions.submit')
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddStudent;
