import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { createOwnerRequestSchema, type CreateOwnerRequest } from '@repo/contracts/schemas/owner/createOwnerRequest';
import { ownerService } from '@/api/service/ownerService';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SchoolBoardingIndex = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['school-onboarding', 'create'],
    mutationFn: ownerService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-onboarding'], exact: false });
    },
  });

  const form = useForm<CreateOwnerRequest>({
    resolver: zodResolver(createOwnerRequestSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
    },
  });

  const onSubmit: SubmitHandler<CreateOwnerRequest> = async (data) => {
    try {
      await mutateAsync({ data });
      toast.success(`Owner created successfully`);
    } catch {
      toast.error(`Failed to create owner`);
    }
  };

  return (
    <div className='bg-background flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8'>
      <Card className='border-border/40 w-full max-w-md border shadow-lg'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-center text-2xl font-bold tracking-tight sm:text-left'>Create Owner</CardTitle>
          <CardDescription className='text-center sm:text-left'>
            Please enter the owner's details to initialize the school setup.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FieldGroup>
              <Controller
                name='firstName'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='first-name-input'>First Name</FieldLabel>
                    <Input
                      {...field}
                      id='first-name-input'
                      aria-invalid={fieldState.invalid}
                      placeholder='First Name'
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name='lastName'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='last-name-input'>Last Name</FieldLabel>
                    <Input {...field} id='last-name-input' aria-invalid={fieldState.invalid} placeholder='Last Name' />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name='phone'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='phone-input'>Phone Number</FieldLabel>
                    <Input {...field} id='phone-input' aria-invalid={fieldState.invalid} placeholder='Phone Number' />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button type='submit' className='mt-2 w-full' disabled={isPending}>
              {isPending && <Spinner className='mr-2 h-4 w-4' />}
              Create Owner
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolBoardingIndex;
