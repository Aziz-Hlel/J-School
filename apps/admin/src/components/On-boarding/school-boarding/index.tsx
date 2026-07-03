import schoolService from '@/api/service/schoolService';
import ImageUpload from '@/components/custom/ImageUpload/comp/ImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateSchoolRequestSchema,
  type CreateSchoolRequest,
} from '@repo/contracts/schemas/school/createSchoolRequest';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const SchoolBoardingIndex = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const bootstrap = useAuthStore((s) => s.bootstrap);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['school-onboarding', 'create'],
    mutationFn: schoolService.create,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['school-onboarding'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['school'], exact: false });
      await bootstrap();
      navigate('/');
    },
  });

  const form = useForm<CreateSchoolRequest>({
    resolver: zodResolver(CreateSchoolRequestSchema),
    defaultValues: {
      nameEn: '',
      nameFr: '',
      nameAr: '',
      email: '',
      address: '',
      phone: '',
      website: '',
      description: '',
      logoId: '',
    },
  });

  const onSubmit: SubmitHandler<CreateSchoolRequest> = async (data) => {
    try {
      await mutateAsync(data);
      toast.success(`School created successfully`);
    } catch {
      toast.error(`Failed to create school`);
    }
  };

  const thumbnailErrors = [form.formState.errors.logoId?.message];
  const clearMediaErrors = () => {
    form.clearErrors('logoId');
  };

  const handleThumbnailUpload = (newMediaId: string | null) => {
    form.setValue('logoId', newMediaId ?? null, newMediaId ? { shouldDirty: true, shouldValidate: true } : undefined);
  };

  return (
    <div className='bg-background flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8'>
      <Card className='border-border/40 w-full max-w-xl border shadow-lg'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-center text-2xl font-bold tracking-tight sm:text-left'>Create School</CardTitle>
          <CardDescription className='text-center sm:text-left'>
            Please enter the school's details to initialize the school setup.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FieldGroup>
              <ImageUpload
                initMedia={null}
                mediaErrors={thumbnailErrors}
                clearMediaErrors={clearMediaErrors}
                handleMediaUpload={handleThumbnailUpload}
              />

              {/* Name (English) */}
              <Controller
                name='nameEn'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='nameEn'>Name (English)</FieldLabel>
                    <Input
                      {...field}
                      id='nameEn'
                      aria-invalid={fieldState.invalid}
                      placeholder='School Name in English'
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Name (French) */}
              <Controller
                name='nameFr'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='nameFr'>Name (French)</FieldLabel>
                    <Input
                      {...field}
                      id='nameFr'
                      aria-invalid={fieldState.invalid}
                      placeholder='School Name in French'
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Name (Arabic) */}
              <Controller
                name='nameAr'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='nameAr'>Name (Arabic)</FieldLabel>
                    <Input
                      {...field}
                      id='nameAr'
                      aria-invalid={fieldState.invalid}
                      placeholder='School Name in Arabic'
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Email */}
              <Controller
                name='email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='email'>School Email Address</FieldLabel>
                    <Input
                      {...field}
                      type='email'
                      id='email'
                      aria-invalid={fieldState.invalid}
                      placeholder='contact@school.com'
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Address */}
              <Controller
                name='address'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='address'>School Address</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      id='address'
                      aria-invalid={fieldState.invalid}
                      placeholder='School Street Address'
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Phone */}
              <Controller
                name='phone'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='phone'>School Phone Number</FieldLabel>
                    <Input {...field} id='phone' aria-invalid={fieldState.invalid} placeholder='Phone Number' />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Website */}
              <Controller
                name='website'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='website'>Website URL</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      id='website'
                      aria-invalid={fieldState.invalid}
                      placeholder='https://school.com'
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
                    <FieldLabel htmlFor='description'>Description</FieldLabel>
                    <Textarea
                      {...field}
                      value={field.value ?? ''}
                      id='description'
                      aria-invalid={fieldState.invalid}
                      placeholder='A short description of the school'
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button type='submit' className='mt-2 w-full' disabled={isPending}>
              {isPending && <Spinner className='mr-2 h-4 w-4' />}
              Create School
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolBoardingIndex;
