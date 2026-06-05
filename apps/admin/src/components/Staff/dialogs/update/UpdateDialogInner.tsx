import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { useSelectedRow } from '../../context/selected-row-provider';
import { MODULE_NAME } from '../../core/core';
import FormUI from '../shared/FormUI';
import type { TableRowType } from '../../core/types';
import { operations, type schemasType } from '../../core/services';

const UpdateDialogInner = ({ selectedRow }: { selectedRow: TableRowType }) => {
  const { handleCancel } = useSelectedRow();

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: operations.update.mutationKey({}),
    mutationFn: operations.update.fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MODULE_NAME], exact: false });
      handleCancel();
    },
  });

  const defaultValues = operations.update.defaultValues(selectedRow);

  const form = useForm<schemasType['update']>({
    resolver: zodResolver(operations.update.schema),
    defaultValues: defaultValues,
  });

  const onSubmit: SubmitHandler<schemasType['update']> = async (payload) => {
    try {
      await mutateAsync({ id: selectedRow.id, payload });
      toast.success('Product updated successfully');
    } catch (error) {
      toast.error('Failed to update product');
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
