import { feesService } from '@/api/service/feesService';
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
import type { FeesResponse } from '@repo/contracts/schemas/Fees/response';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { type UpdateFeesReq, updateFeesReqSchema } from '@repo/contracts/schemas/Fees/update';

const EditFee = ({
  fee,
  studentId,
  setIsEditOpen,
}: {
  fee: FeesResponse;
  studentId: string;
  setIsEditOpen: (open: boolean) => void;
}) => {
  const schoolId = useCurrentSchoolId();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['students', studentId, 'fees', 'update'],
    mutationFn: (payload: UpdateFeesReq) => feesService.update({ schoolId, feeId: fee.id, body: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', studentId, 'fees'], exact: false });
      setIsEditOpen(false);
      form.reset();
    },
  });

  const defaultValues: UpdateFeesReq = {
    name: fee.name,
    startDate: fee.startDate,
    endDate: fee.endDate,
  };

  const form = useForm<UpdateFeesReq>({
    resolver: zodResolver(updateFeesReqSchema),
    defaultValues,
  });

  const onSubmit = async (data: UpdateFeesReq) => {
    try {
      await mutateAsync(data);
      toast.success('Fee cycle updated successfully');
    } catch {
      toast.error('Failed to update fee cycle');
    }
  };

  return (
    <Dialog open={true} onOpenChange={setIsEditOpen}>
      <DialogContent className='rounded-2xl sm:max-w-106.25'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-slate-800 dark:text-slate-100'>Add Fee Cycle</DialogTitle>
          <DialogDescription>Create a new fee cycle configuration for this student.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 py-4'>
          <FieldGroup>
            {/* Name */}
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='add-name'>Fee Cycle Name</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    id='add-name'
                    aria-invalid={fieldState.invalid}
                    placeholder='e.g., Semester 1 Tuition Fee'
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Start & End Dates */}
            <div className='grid grid-cols-2 gap-4'>
              <Controller
                name='startDate'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='add-start-date'>Start Date</FieldLabel>
                    <Input
                      type='date'
                      {...field}
                      value={field.value}
                      id='add-start-date'
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name='endDate'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='add-end-date'>End Date</FieldLabel>
                    <Input
                      type='date'
                      {...field}
                      value={field.value}
                      id='add-end-date'
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
          <DialogFooter className='gap-2 pt-4 sm:gap-0'>
            <Button
              type='button'
              variant='outline'
              className='rounded-xl border-slate-200 dark:border-zinc-800'
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl'
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                'Save Fee'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFee;
