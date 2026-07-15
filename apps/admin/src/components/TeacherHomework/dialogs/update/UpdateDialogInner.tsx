import { staffService } from '@/api/service/staffService';
import ImageUpload from '@/components/custom/ImageUpload/comp/ImageUpload';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { zodResolver } from '@hookform/resolvers/zod';
import type { UpdateSimpleUserRequest } from '@repo/contracts/schemas/user/updateSimpleUserRequest';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { useSelectedRow } from '../../context/selected-row-provider';
import { operations, type schemasType } from '../../core/services';
import type { TableRowType } from '../../core/types';

const UpdateDialogInner = ({ selectedRow }: { selectedRow: TableRowType }) => {
  const { handleCancel } = useSelectedRow();

  const queryClient = useQueryClient();
  const schoolId = useCurrentSchoolId();
  const id = selectedRow.id;

  const { mutateAsync, isPending } = useMutation({
    mutationKey: operations.update.mutationKey({}),
    mutationFn: (data: UpdateSimpleUserRequest) => staffService.update(schoolId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'], exact: false });
      handleCancel();
    },
  });

  const defaultValues: UpdateSimpleUserRequest = {
    firstName: selectedRow.firstName,
    lastName: selectedRow.lastName,
    gender: selectedRow.gender,
    dateOfBirth: selectedRow.dateOfBirth,
    address: selectedRow.address,
    phone: selectedRow.phone,
    cin: selectedRow.cin,
    avatarId: selectedRow.avatar?.id ?? null,
  };

  const form = useForm<schemasType['update']>({
    resolver: zodResolver(operations.update.schema),
    defaultValues: defaultValues,
  });

  const onSubmit: SubmitHandler<schemasType['update']> = async (data) => {
    try {
      await mutateAsync(data);
      toast.success('Staff updated successfully');
    } catch {
      toast.error('Failed to update staff');
    }
  };

  console.log(form.formState.errors);

  const thumbnailErrors = [form.formState.errors.avatarId?.message];

  const clearMediaErrors = () => {
    form.clearErrors('avatarId');
  };

  const handleThumbnailUpload = (newMediaId: string | null) => {
    form.setValue('avatarId', newMediaId ?? '', newMediaId ? { shouldDirty: true, shouldValidate: true } : undefined);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='flex h-full flex-col space-y-6'>
      <div className='min-h-0 flex-1 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent overflow-y-auto overscroll-contain pr-2 hover:scrollbar-thumb-neutral-400'>
        <FieldGroup>
          <ImageUpload
            initMedia={selectedRow.avatar ?? null}
            mediaErrors={thumbnailErrors}
            clearMediaErrors={clearMediaErrors}
            handleMediaUpload={handleThumbnailUpload}
          />

          <Controller
            name='firstName'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`first-name-input`}>First Name</FieldLabel>
                <Input {...field} id={`first-name-input`} aria-invalid={fieldState.invalid} placeholder='First Name' />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name='lastName'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`last-name-input`}>Last Name</FieldLabel>
                <Input {...field} id={`last-name-input`} aria-invalid={fieldState.invalid} placeholder='Last Name' />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name='dateOfBirth'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`date-of-birth-input`}>Date of Birth</FieldLabel>
                <Input
                  type='date'
                  {...field}
                  value={field.value ?? undefined}
                  id={`date-of-birth-input`}
                  aria-invalid={fieldState.invalid}
                  placeholder='Date of Birth'
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name='gender'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`gender-input`}>Gender</FieldLabel>
                <Input {...field} id={`gender-input`} aria-invalid={fieldState.invalid} placeholder='Gender' />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name='address'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`address-input`}>Address</FieldLabel>
                <Input
                  {...field}
                  id={`address-input`}
                  value={field.value ?? undefined}
                  aria-invalid={fieldState.invalid}
                  placeholder='Address'
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
                <FieldLabel htmlFor={`phone-input`}>Phone</FieldLabel>
                <Input
                  {...field}
                  id={`phone-input`}
                  value={field.value ?? undefined}
                  aria-invalid={fieldState.invalid}
                  placeholder='Phone'
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
                <FieldLabel htmlFor={`cin-input`}>CIN</FieldLabel>
                <Input
                  {...field}
                  id={`cin-input`}
                  value={field.value ?? undefined}
                  aria-invalid={fieldState.invalid}
                  placeholder='CIN'
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
            Cancel
          </Button>
        </DialogClose>
        <Button type='submit' className='w-28' disabled={isPending}>
          {isPending ? <Spinner /> : <span>Save changes</span>}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default UpdateDialogInner;
