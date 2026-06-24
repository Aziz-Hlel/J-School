import { staffService } from '@/api/service/staffService';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { zodResolver } from '@hookform/resolvers/zod';
import type { UpdateSimpleUserRequest } from '@repo/contracts/schemas/user/updateSimpleUserRequest';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { useSelectedRow } from '../../context/selected-row-provider';
import { operations, type schemasType } from '../../core/services';
import type { TableRowType } from '../../core/types';
import FormUI from '../shared/FormUI';

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
    // phone: selectedRow.phone,
    // avatarId: selectedRow.,
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

  const thumbnailErrors = [form.formState.errors.thumbnailId?.message];

  const clearMediaErrors = () => {
    form.clearErrors('thumbnailId');
  };

  const handleThumbnailUpload = (newMediaId: string | null) => {
    form.setValue(
      'thumbnailId',
      newMediaId ?? '',
      newMediaId ? { shouldDirty: true, shouldValidate: true } : undefined,
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='flex h-full flex-col space-y-6'>
      <div className='min-h-0 flex-1 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent overflow-y-auto overscroll-contain pr-2 hover:scrollbar-thumb-neutral-400'>
        <FieldGroup>
          <FormUI
            form={form}
            initMedia={selectedRow.thumbnail}
            thumbnailErrors={thumbnailErrors}
            clearMediaErrors={clearMediaErrors}
            handleThumbnailUpload={handleThumbnailUpload}
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
