import { feesItemsService } from '@/api/service/feesItemsService';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import queryClient from '@/config/react-qeury';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateFeeItemsReqSchema, type UpdateFeeItemsReq } from '@repo/contracts/schemas/FeeItems/update';
import type { FeeItemsResponse } from '@repo/contracts/schemas/FeeItems/response';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const FEE_ITEM_STATUSES = ['PAID', 'UNPAID', 'PARTIALLY_PAID'] as const;

const EditFeeItem = ({
  item,
  studentId,
  feeId,
  setIsEditOpen,
}: {
  item: FeeItemsResponse;
  studentId: string;
  feeId: string;
  setIsEditOpen: (open: boolean) => void;
}) => {
  const schoolId = useCurrentSchoolId();

  const defaultValues: UpdateFeeItemsReq = {
    title: item.title,
    description: item.description ?? '',
    amount: item.amount,
    status: item.status,
    payment: item.payment
      ? {
          method: item.payment.method,
          reference: item.payment.reference ?? null,
          date: item.payment.date ?? null,
        }
      : null,
  };

  const form = useForm<UpdateFeeItemsReq>({
    resolver: zodResolver(updateFeeItemsReqSchema),
    defaultValues,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['students', studentId, 'fees', feeId, 'items', 'update'],
    mutationFn: (payload: UpdateFeeItemsReq) => feesItemsService.update(schoolId, feeId, item.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['students', studentId, 'fees'],
        exact: false,
      });
      setIsEditOpen(false);
      form.reset();
    },
  });

  const onSubmit = async (data: UpdateFeeItemsReq) => {
    try {
      await mutateAsync(data);
      toast.success('Fee item updated successfully');
    } catch {
      toast.error('Failed to update fee item');
    }
  };

  return (
    <Dialog open={true} onOpenChange={setIsEditOpen}>
      <DialogContent className='rounded-2xl sm:max-w-106.25'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-slate-800 dark:text-slate-100'>Edit Fee Item</DialogTitle>
          <DialogDescription>Update the details of this fee item.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 py-4'>
          <FieldGroup>
            {/* Title */}
            <Controller
              name='title'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='edit-item-title'>Title</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    id='edit-item-title'
                    aria-invalid={fieldState.invalid}
                    placeholder='e.g., Tuition Fee'
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Description */}
            <Controller
              name='description'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='edit-item-description'>
                    Description <span className='text-muted-foreground text-xs'>(optional)</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    id='edit-item-description'
                    aria-invalid={fieldState.invalid}
                    placeholder='Additional details...'
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Amount & Status */}
            <div className='grid grid-cols-2 gap-4'>
              <Controller
                name='amount'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='edit-item-amount'>Amount</FieldLabel>
                    <Input
                      type='number'
                      min={0}
                      step='0.01'
                      id='edit-item-amount'
                      aria-invalid={fieldState.invalid}
                      value={field.value ?? 0}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      placeholder='0.00'
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name='status'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='edit-item-status'>Status</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id='edit-item-status' aria-invalid={fieldState.invalid} className='w-full'>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                      <SelectContent>
                        {FEE_ITEM_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s
                              .replace(/_/g, ' ')
                              .toLowerCase()
                              .replace(/^\w/, (c) => c.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFeeItem;
