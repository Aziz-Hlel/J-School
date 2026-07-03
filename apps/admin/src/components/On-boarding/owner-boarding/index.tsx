import { ownerService } from '@/api/service/ownerService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOwnerRequestSchema, type CreateOwnerRequest } from '@repo/contracts/schemas/owner/createOwnerRequest';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const OwnerBoardingIndex = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['owner-onboarding', 'create'],
    mutationFn: ownerService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-onboarding'], exact: false });
      navigate('/on-boarding/school');
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
      <Card className='border-border/40 w-full max-w-xl border shadow-lg'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-center text-2xl font-bold tracking-tight sm:text-left'>
            School's Owner Details
          </CardTitle>
          <CardDescription className='text-center sm:text-left'>
            Please enter your details to initialize the school setup.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='firstName'>First Name</FieldLabel>
                <Controller
                  name='firstName'
                  control={form.control}
                  render={({ field }) => (
                    <>
                      <Input id='firstName' {...field} placeholder='First Name' />
                      <FieldError />
                    </>
                  )}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor='lastName'>Last Name</FieldLabel>
                <Controller
                  name='lastName'
                  control={form.control}
                  render={({ field }) => (
                    <>
                      <Input id='lastName' {...field} placeholder='Last Name' />
                      <FieldError />
                    </>
                  )}
                />
              </Field>
            </FieldGroup>
            <Field>
              <FieldLabel htmlFor='phone'>Phone</FieldLabel>
              <Controller
                name='phone'
                control={form.control}
                render={({ field }) => (
                  <>
                    <Input id='phone' {...field} placeholder='Phone' />
                    <FieldError />
                  </>
                )}
              />
            </Field>
            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? <Spinner className='mr-2 h-4 w-4' /> : null}
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerBoardingIndex;
