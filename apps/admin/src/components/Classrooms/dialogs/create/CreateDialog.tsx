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
import { FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { useAuthStore } from '@/store/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { useSelectedRow } from '../../context/selected-row-provider';
import { TableData } from '../../core/core';
import { operations, type schemasType } from '../../core/services';
import FormUI from '../shared/FormUI';

const CreateDialog = () => {
  const { handleCancel, dialogState } = useSelectedRow();
  const queryClient = useQueryClient();
  const schoolId = useAuthStore((state) => state.schoolId);

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
      await mutateAsync({ schoolId, data });
      toast.success(`${TableData.ModuleName} created successfully`);
    } catch {
      toast.error(`Failed to create ${TableData.ModuleName}`);
    }
  };

  const dialogIsOpen = dialogState.openDialog === 'add';

  return (
    <Dialog onOpenChange={onOpenChange} open={dialogIsOpen}>
      <DialogContent className='flex h-fit flex-col overflow-hidden sm:max-w-106.25'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex h-full flex-col space-y-6'>
          <DialogHeader>
            <DialogTitle className='bg-__tw_debug'>{TableData.AddDialog.title}</DialogTitle>
            <DialogDescription>{TableData.AddDialog.description}</DialogDescription>
          </DialogHeader>
          <div className='scrollbar-thumb-border hover:scrollbar-thumb-border/50 scrollbar-thin scrollbar-track-transparent pr-2'>
            <FieldGroup>
              <FormUI form={form} />
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
