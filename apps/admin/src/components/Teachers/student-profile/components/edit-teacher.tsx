import { teacherService } from '@/api/service/teachersService';
import ImageUpload from '@/components/custom/ImageUpload/comp/ImageUpload';
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
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import queryClient from '@/config/react-qeury';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  updateTeacherRequestSchema,
  type UpdateTeacherRequest,
} from '@repo/contracts/schemas/teacher/updateTeacherRequest';
import { Gender } from '@repo/contracts/types/enums/enums';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useSelectedRow } from '../../table/context/selected-row-provider';

const EditTeacher = () => {
  const { handleCancel, dialogState } = useSelectedRow();

  const schoolId = useCurrentSchoolId();
  const dialogIsOpen = dialogState.openDialog === 'edit';
  const teacher = dialogIsOpen ? dialogState.selectedRow : undefined;
  if (!teacher) throw new Error('No teacher selected');

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['teachers', teacher.id, 'update'],
    mutationFn: (payload: UpdateTeacherRequest) => teacherService.update({ schoolId, id: teacher.id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'], exact: false });
      handleCancel();
    },
  });

  const defaultValues: UpdateTeacherRequest | undefined = dialogIsOpen
    ? {
        firstName: teacher.firstName || '',
        lastName: teacher.lastName || '',
        gender: teacher.gender || Gender.MALE,
        dateOfBirth: teacher.dateOfBirth,
        phone: teacher.phone || null,
        cin: teacher.cin || null,
        address: teacher.address || null,
        avatarId: teacher.avatar?.id || null,
      }
    : undefined;
  const form = useForm<UpdateTeacherRequest>({
    resolver: zodResolver(updateTeacherRequestSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: UpdateTeacherRequest) => {
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
      <Dialog onOpenChange={handleCancel} open={dialogIsOpen}>
        <DialogContent className='flex h-[calc(100dvh-4rem)] flex-col overflow-hidden sm:max-w-120'>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex h-full flex-col space-y-6'>
            <DialogHeader>
              <DialogTitle>Create new teacher</DialogTitle>
              <DialogDescription>Add a new teacher</DialogDescription>
            </DialogHeader>
            <div className='min-h-0 flex-1 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent overflow-y-auto overscroll-contain pr-2 pb-6 hover:scrollbar-thumb-neutral-400'>
              <FieldGroup>
                <ImageUpload
                  initMedia={teacher.avatar ?? null}
                  mediaErrors={thumbnailErrors}
                  clearMediaErrors={clearMediaErrors}
                  handleMediaUpload={handleThumbnailUpload}
                />

                {/* First Name & Last Name */}
                <div className='grid grid-cols-2 gap-4'>
                  <Controller
                    name='firstName'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='firstName'>First Name</FieldLabel>
                        <Input
                          {...field}
                          value={field.value ?? undefined}
                          id='firstName'
                          aria-invalid={fieldState.invalid}
                          placeholder='First Name'
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
                        <FieldLabel htmlFor='lastName'>Last Name</FieldLabel>
                        <Input
                          {...field}
                          value={field.value ?? undefined}
                          id='lastName'
                          aria-invalid={fieldState.invalid}
                          placeholder='Last Name'
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
                {/* Email & Phone */}
                <div className='grid grid-cols-2 gap-4'>
                  {/* Gender & Role */}
                  <Controller
                    name='gender'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='gender'>Gender</FieldLabel>
                        <SelectForm field={field} options={Gender} placeholder='Select gender' label='Gender' />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name='phone'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='phone'>Phone</FieldLabel>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value || null)}
                          id='phone'
                          aria-invalid={fieldState.invalid}
                          placeholder='Phone Number'
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
                        <FieldLabel htmlFor='dateOfBirth'>Date of Birth</FieldLabel>
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
                        <FieldLabel htmlFor='cin'>CIN</FieldLabel>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value || null)}
                          id='cin'
                          aria-invalid={fieldState.invalid}
                          placeholder='CIN'
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
                      <FieldLabel htmlFor='address'>Address</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        id='address'
                        aria-invalid={fieldState.invalid}
                        placeholder='Address'
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline' onClick={() => handleCancel()}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type='submit' className='w-28' disabled={isPending}>
                {isPending ? <Spinner /> : <span>Create teacher</span>}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditTeacher;
