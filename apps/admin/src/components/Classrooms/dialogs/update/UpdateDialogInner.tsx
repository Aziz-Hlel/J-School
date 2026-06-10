import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClassGrade } from '@repo/contracts/types/enums/enums';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { useSelectedRow } from '../../context/selected-row-provider';
import { MODULE_NAME } from '../../core/core';
import { operations, type schemasType } from '../../core/services';
import type { TableRowType } from '../../core/types';

const UpdateDialogInner = ({ selectedRow }: { selectedRow: TableRowType }) => {
  const { handleCancel } = useSelectedRow();
  const schoolId = useAuthStore((state) => state.schoolId);

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

  console.log(form.formState.errors);

  const onSubmit: SubmitHandler<schemasType['update']> = async (data) => {
    try {
      await mutateAsync({ schoolId, id: selectedRow.id, data });
      toast.success('Class updated successfully');
    } catch {
      toast.error('Failed to update class');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='flex h-full flex-col space-y-6'>
      <div className='min-h-0 flex-1 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent overflow-y-auto overscroll-contain pr-2 hover:scrollbar-thumb-neutral-400'>
        <FieldGroup>
          <Controller
            name='name'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`name-input`}>Name</FieldLabel>
                <Input {...field} id={`name-input`} aria-invalid={fieldState.invalid} placeholder='Name' />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Field className='flex'>
            <FieldLabel htmlFor={`grade-input`}>Grade</FieldLabel>
            <Select value={selectedRow.grade} disabled>
              <SelectTrigger className='w-45'>
                <SelectValue placeholder={'placeholder'} />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ClassGrade).map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Controller
            name='description'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`description-input`}>Description</FieldLabel>
                <Textarea
                  {...field}
                  id={`description-input`}
                  aria-invalid={fieldState.invalid}
                  placeholder='Description'
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
