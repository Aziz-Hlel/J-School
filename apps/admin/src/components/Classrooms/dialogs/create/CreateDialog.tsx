import { useSelectedRow } from '../../context/selected-row-provider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { FieldGroup } from '@/components/ui/field';
import { toast } from 'sonner';
import { TableData } from '../../core/core';
import FormUI from '../shared/FormUI';
import { operations, type schemasType } from '../../core/services';

const CreateDialog = () => {
  const { handleCancel, dialogState } = useSelectedRow();
  const queryClient = useQueryClient();

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

  const onSubmit: SubmitHandler<schemasType['create']> = async (data) => {
    try {
      await mutateAsync(data);
      toast.success(`${TableData.ModuleName} created successfully`);
    } catch (error) {
      toast.error(`Failed to create ${TableData.ModuleName}`);
    }
  };

  const dialogIsOpen = dialogState.openDialog === 'add';

  const thumbnailErrors = [form.formState.errors.thumbnailId?.message];

  const clearMediaErrors = () => {
    form.clearErrors('thumbnailId');
  };

  const handleThumbnailUpload = (newMediaId: string | null) => {
    const options = newMediaId ? { shouldDirty: true, shouldValidate: true } : undefined;
    form.setValue('thumbnailId', newMediaId ?? '', options);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={dialogIsOpen}>
      <DialogContent className='flex h-[calc(100dvh-4rem)] flex-col overflow-hidden sm:max-w-106.25'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex h-full flex-col space-y-6'>
          <DialogHeader>
            <DialogTitle className='bg-__tw_debug'>{TableData.AddDialog.title}</DialogTitle>
            <DialogDescription>{TableData.AddDialog.description}</DialogDescription>
          </DialogHeader>
          <div className='min-h-0 flex-1 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent overflow-y-auto overscroll-contain pr-2 hover:scrollbar-thumb-neutral-400'>
            <FieldGroup>
              <FormUI
                form={form}
                initMedia={null}
                thumbnailErrors={thumbnailErrors}
                clearMediaErrors={clearMediaErrors}
                handleThumbnailUpload={handleThumbnailUpload}
              />
            </FieldGroup>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' onClick={handleCancel}>
                {TableData.AddDialog.buttons.cancel}
              </Button>
            </DialogClose>
            <Button type='submit' className='w-28' disabled={isPending}>
              {isPending ? <Spinner /> : <span>{TableData.AddDialog.buttons.submit}</span>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
