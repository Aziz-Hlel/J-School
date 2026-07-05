import { feesService } from '@/api/service/feesService';
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
import queryClient from '@/config/react-qeury';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFeesReqSchema, type CreateFeesReq } from '@repo/contracts/schemas/Fees/create';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const AddFees = ({ children, studentId }: { children: ReactNode; studentId: string; schoolId?: string }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const schoolId = useCurrentSchoolId();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['students', studentId, 'fees', 'create'],
    mutationFn: (payload: CreateFeesReq) => feesService.create({ schoolId, body: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', studentId, 'fees'], exact: false });
      setIsAddOpen(false);
      form.reset();
    },
  });

  const defaultValues: CreateFeesReq = {
    name: '',
    studentId: studentId,
    startDate: '',
    endDate: '',
  };

  const form = useForm<CreateFeesReq>({
    resolver: zodResolver(createFeesReqSchema),
    defaultValues,
  });

  const onSubmit = async (data: CreateFeesReq) => {
    try {
      await mutateAsync(data);
      toast.success('Fee cycle added successfully');
    } catch {
      toast.error('Failed to add fee cycle');
    }
  };

  return (
    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
                      value={field.value ? field.value.split('T')[0] : ''}
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
                      value={field.value ? field.value.split('T')[0] : ''}
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
              onClick={() => setIsAddOpen(false)}
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

export default AddFees;
