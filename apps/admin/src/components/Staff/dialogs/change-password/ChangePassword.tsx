import userService from '@/api/service/userService';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePasswordRequestSchema, type UpdatePasswordRequest } from '@repo/contracts/schemas/user/updatePassword';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next'; // 1. Import i18n
import { toast } from 'sonner';
import { z } from 'zod';
import { useSelectedRow } from '../../context/selected-row-provider';

// Utilisation des clés i18n comme chaînes de message par défaut dans le schéma Zod
const changePasswordSchema = updatePasswordRequestSchema
  .extend({
    confirmPassword: z.string().min(8, 'password.errors.min_length'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'password.errors.mismatch',
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const ChangePassword = () => {
  const { t } = useTranslation(['staff']); // 2. Initialisation d'i18n
  const { handleCancel, dialogState } = useSelectedRow();
  const queryClient = useQueryClient();
  const schoolId = useCurrentSchoolId();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['staff', 'update-password'],
    mutationFn: userService.updatePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'], exact: false });
      form.reset({ password: '', confirmPassword: '' });
      handleCancel();
    },
  });

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const dialogIsOpen = dialogState.openDialog === 'change-password';
  const selectedRow = dialogIsOpen ? dialogState.selectedRow : null;

  const fullName = selectedRow ? [selectedRow.firstName, selectedRow.lastName].filter(Boolean).join(' ') : '';
  const displayName = fullName || t('staff:password.unknown_user');
  const displayEmail = selectedRow?.email || t('staff:password.no_email');
  const initials = [selectedRow?.firstName?.[0], selectedRow?.lastName?.[0]].filter(Boolean).join('') || '?';

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset({ password: '', confirmPassword: '' });
      handleCancel();
    }
  };

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = async (data) => {
    if (!selectedRow) return;

    try {
      const input: UpdatePasswordRequest = {
        password: data.password,
      };
      await mutateAsync({
        userId: selectedRow.id,
        schoolId,
        input,
      });
      toast.success(t('staff:password.success_toast'));
    } catch {
      toast.error(t('staff:password.failed_toast'));
    }
  };

  // Helper local pour intercepter et traduire à la volée les erreurs Zod
  const getTransformedError = (error: any) => {
    if (!error) return undefined;
    return {
      ...error,
      message: t(error.message), // t() renverra la traduction ou la clé brute si elle n'est pas trouvée (ex: erreur de l'API/Zod natif)
    };
  };

  return (
    <Dialog open={dialogIsOpen} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[calc(100dvh-4rem)] flex-col overflow-hidden sm:max-w-xl'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex h-full flex-col gap-6'>
          <DialogHeader>
            <DialogTitle>{t('staff:password.title')}</DialogTitle>
            <DialogDescription>{t('staff:password.description')}</DialogDescription>
          </DialogHeader>

          <div className='min-h-0 flex-1 overflow-y-auto pr-2'>
            <FieldGroup className='flex flex-col gap-6'>
              <Card className='border-border/70 shadow-none'>
                <CardContent className='flex items-center gap-4 p-4'>
                  <Avatar className='size-12 shrink-0'>
                    <AvatarFallback className='text-sm font-semibold'>{initials}</AvatarFallback>
                  </Avatar>
                  <div className='min-w-0 flex-1'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <p className='text-foreground truncate font-semibold'>{displayName}</p>
                      <Badge variant='secondary'>{t('staff:password.target_badge')}</Badge>
                    </div>
                    <p className='text-muted-foreground truncate text-sm'>{displayEmail}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className='border-destructive/20 bg-destructive/5 shadow-none'>
                <CardContent className='flex flex-col gap-2 p-4'>
                  <div className='flex items-center gap-2'>
                    <Badge variant='destructive'>{t('staff:password.confirm_badge')}</Badge>
                    <span className='text-foreground text-sm font-medium'>{t('staff:password.warning_title')}</span>
                  </div>
                  <p className='text-muted-foreground text-sm'>{t('staff:password.warning_description')}</p>
                </CardContent>
              </Card>

              <Separator />

              <Field data-invalid={!!form.formState.errors.password}>
                <FieldLabel htmlFor='password'>{t('staff:password.fields.new_password')}</FieldLabel>
                <Input
                  id='password'
                  type='password'
                  autoComplete='new-password'
                  placeholder={t('staff:password.fields.new_password_placeholder')}
                  aria-invalid={!!form.formState.errors.password}
                  {...form.register('password')}
                />
                <p className='text-muted-foreground text-sm'>{t('staff:password.fields.new_password_hint')}</p>
                {form.formState.errors.password && (
                  <FieldError errors={[getTransformedError(form.formState.errors.password)]} />
                )}
              </Field>

              <Field data-invalid={!!form.formState.errors.confirmPassword}>
                <FieldLabel htmlFor='confirmPassword'>{t('staff:password.fields.confirm_password')}</FieldLabel>
                <Input
                  id='confirmPassword'
                  type='password'
                  autoComplete='new-password'
                  placeholder={t('staff:password.fields.confirm_password_placeholder')}
                  aria-invalid={!!form.formState.errors.confirmPassword}
                  {...form.register('confirmPassword')}
                />
                <p className='text-muted-foreground text-sm'>{t('staff:password.fields.confirm_password_hint')}</p>
                {form.formState.errors.confirmPassword && (
                  <FieldError errors={[getTransformedError(form.formState.errors.confirmPassword)]} />
                )}
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={handleCancel} disabled={isPending}>
              {t('staff:password.actions.cancel')}
            </Button>
            <Button type='submit' disabled={isPending} className='min-w-36'>
              {isPending ? <Spinner /> : <span>{t('staff:password.actions.submit')}</span>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePassword;
