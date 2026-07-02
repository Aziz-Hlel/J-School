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
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import queryClient from '@/config/react-qeury';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { zodResolver } from '@hookform/resolvers/zod';
import type { StudentFullDetailsResponse } from '@repo/contracts/schemas/student/studentFullDetails';
import {
  updateStudentWithStatusRequestSchema,
  type UpdateWithStatusStudentReq,
} from '@repo/contracts/schemas/student/updateStudentWithStatusRequest';
import { Gender, StudentStatus } from '@repo/contracts/types/enums/enums';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const EditStudent = ({
  setIsEditOpen,
  student,
}: {
  setIsEditOpen: (value: boolean) => void;
  student: StudentFullDetailsResponse;
}) => {
  const schoolId = useCurrentSchoolId();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['students', student.id, 'update'],
    mutationFn: (payload: UpdateWithStatusStudentReq) => studentService.updateWithStatus(schoolId, student.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'], exact: false });
      setIsEditOpen(false);
    },
  });

  const defaultValues: UpdateWithStatusStudentReq = {
    uid: student.uid,
    dateOfBirth: student.dateOfBirth,
    gender: student.gender,
    status: student.status,
    firstName: {
      en: student.firstName.en,
      ar: student.firstName.ar,
    },
    lastName: {
      en: student.lastName.en,
      ar: student.lastName.ar,
    },
    avatarId: student.avatar?.id || null,
  };
  const form = useForm<UpdateWithStatusStudentReq>({
    resolver: zodResolver(updateStudentWithStatusRequestSchema),
    defaultValues: defaultValues,
  });

  const handleUpdateStudent = async (data: UpdateWithStatusStudentReq) => {
    try {
      await mutateAsync(data);
      toast.success('Student updated successfully');
    } catch {
      toast.error('Failed to update student');
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
      {/* DIALOG 1: EDIT STUDENT INFO */}
      {/* ======================================================== */}
      <Dialog open={true} onOpenChange={setIsEditOpen}>
        <DialogContent className='flex h-[calc(100dvh-4rem)] flex-col overflow-hidden rounded-2xl sm:max-w-120'>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold text-slate-800 dark:text-slate-100'>
              Edit Student Information
            </DialogTitle>
            <DialogDescription>Modify core profile and identity fields for this student record.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleUpdateStudent)} className='flex min-h-0 flex-1 flex-col'>
            <div className='min-h-0 flex-1 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent overflow-y-auto overscroll-contain pr-2 pb-6 hover:scrollbar-thumb-neutral-400'>
              <FieldGroup>
                <ImageUpload
                  initMedia={student?.avatar ?? null}
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
                        <FieldLabel htmlFor='firstNameEn'>First Name (EN)</FieldLabel>
                        <Input
                          {...field}
                          value={field.value ?? undefined}
                          id='firstNameEn'
                          aria-invalid={fieldState.invalid}
                          placeholder='First Name'
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
                        <FieldLabel htmlFor='firstNameAr'>First Name (AR)</FieldLabel>
                        <Input
                          {...field}
                          value={field.value ?? undefined}
                          id='firstNameAr'
                          aria-invalid={fieldState.invalid}
                          placeholder='First Name (AR)'
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
                        <FieldLabel htmlFor='lastNameEn'>Last Name (EN)</FieldLabel>
                        <Input
                          {...field}
                          value={field.value ?? undefined}
                          id='lastNameEn'
                          aria-invalid={fieldState.invalid}
                          placeholder='Last Name'
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
                        <FieldLabel htmlFor='lastNameAr'>Last Name (AR)</FieldLabel>
                        <Input
                          {...field}
                          value={field.value ?? undefined}
                          id='lastNameAr'
                          aria-invalid={fieldState.invalid}
                          placeholder='Last Name (AR)'
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>

                {/* UID (read‑only) */}
                <Controller
                  name='uid'
                  control={form.control}
                  render={({ field }) => (
                    <Field data-invalid={false}>
                      <FieldLabel htmlFor='uid'>UID</FieldLabel>
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
                      <FieldLabel htmlFor='dateOfBirth'>Date of Birth</FieldLabel>
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
                      <FieldLabel htmlFor={`gender-input`}>Gender</FieldLabel>
                      <SelectForm field={field} options={Gender} placeholder='Select gender' label='Gender' />
                    </Field>
                  )}
                />

                {/* Status */}
                <Controller
                  name='status'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className='flex'>
                      <FieldLabel htmlFor={`status-input`}>Status</FieldLabel>
                      <SelectForm field={field} options={StudentStatus} placeholder='Select status' label='Status' />
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
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type='submit' className='bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl'>
                {isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Updating...
                  </>
                ) : (
                  'Update Student Record'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditStudent;
