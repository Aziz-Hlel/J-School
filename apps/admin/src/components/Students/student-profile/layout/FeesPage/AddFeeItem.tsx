import { feesItemsService } from '@/api/service/feesItemsService';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import queryClient from '@/config/react-qeury';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFeeItemsReqSchema, type CreateFeeItemsReq } from '@repo/contracts/schemas/FeeItems/create';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const FEE_ITEM_STATUSES = ['PAID', 'UNPAID', 'PARTIALLY_PAID'] as const;

const AddFeeItem = ({ children, studentId, feeId }: { children: ReactNode; studentId: string; feeId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const schoolId = useCurrentSchoolId();

  const defaultValues: CreateFeeItemsReq = {
    title: '',
    description: '',
    amount: 0,
    status: 'UNPAID',
    payment: null,
  };

  const form = useForm<CreateFeeItemsReq>({
    resolver: zodResolver(createFeeItemsReqSchema),
    defaultValues,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['students', studentId, 'fees', feeId, 'items', 'create'],
    mutationFn: (payload: CreateFeeItemsReq) => feesItemsService.create(schoolId, feeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['students', studentId, 'fees'],
        exact: false,
      });
      setIsOpen(false);
      form.reset(defaultValues);
    },
  });

  const onSubmit = async (data: CreateFeeItemsReq) => {
    try {
      await mutateAsync(data);
      toast.success('Fee item added successfully');
    } catch {
      toast.error('Failed to add fee item');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='rounded-2xl sm:max-w-106.25'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-slate-800 dark:text-slate-100'>Add Fee Item</DialogTitle>
          <DialogDescription>Add a new fee item to this billing cycle.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 py-4'>
          <FieldGroup>
            {/* Title */}
            <Controller
              name='title'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='item-title'>Title</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    id='item-title'
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
                  <FieldLabel htmlFor='item-description'>
                    Description <span className='text-muted-foreground text-xs'>(optional)</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    id='item-description'
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
                    <FieldLabel htmlFor='item-amount'>Amount</FieldLabel>
                    <Input
                      type='number'
                      min={0}
                      step='0.01'
                      id='item-amount'
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
                    <FieldLabel htmlFor='item-status'>Status</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id='item-status' aria-invalid={fieldState.invalid} className='w-full'>
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
              onClick={() => setIsOpen(false)}
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
                'Add Item'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFeeItem;
