import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type FormEvent,
  type MouseEvent,
} from 'react';

import userService from '@/api/service/userService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import queryClient from '@/config/react-qeury';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { cn } from '@/lib/utils';
import type { UpdateUserRolesReq } from '@repo/contracts/schemas/user/updateUserRolesReq';
import { UserRole } from '@repo/contracts/types/enums/enums';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Check, GraduationCap, Loader2, ShieldUser, Trash2, UserStar, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useSelectRolesStore, useSetUserIdStore } from './select-roles-store';

type RoleCard = {
  role: UserRole;
  labelKey: 'roles.director.label' | 'roles.manager.label' | 'roles.teacher.label' | 'roles.parent.label';
  descriptionKey:
    | 'roles.director.description'
    | 'roles.manager.description'
    | 'roles.teacher.description'
    | 'roles.parent.description';
  icon: ComponentType<{ className?: string }>;
};

const ROLE_CARDS = [
  {
    role: UserRole.DIRECTOR,
    labelKey: 'roles.director.label',
    descriptionKey: 'roles.director.description',
    icon: ShieldUser,
  },
  {
    role: UserRole.MANAGER,
    labelKey: 'roles.manager.label',
    descriptionKey: 'roles.manager.description',
    icon: UserStar,
  },
  {
    role: UserRole.TEACHER,
    labelKey: 'roles.teacher.label',
    descriptionKey: 'roles.teacher.description',
    icon: GraduationCap,
  },
  {
    role: UserRole.PARENT,
    labelKey: 'roles.parent.label',
    descriptionKey: 'roles.parent.description',
    icon: Users,
  },
] satisfies RoleCard[];

type RoleOptionCardProps = Omit<RoleCard, 'labelKey' | 'descriptionKey'> & {
  label: string;
  description: string;
  isSelected: boolean;
  onToggle: (role: UserRole) => void;
};

const RoleOptionCard = memo(({ role, label, description, icon: Icon, isSelected, onToggle }: RoleOptionCardProps) => {
  const handleToggle = useCallback(() => {
    onToggle(role);
  }, [onToggle, role]);

  return (
    <Card
      role='checkbox'
      aria-checked={isSelected}
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleToggle();
        }
      }}
      className={cn(
        'group focus-visible:ring-ring relative min-h-32 cursor-pointer gap-3 overflow-hidden p-4 transition-colors outline-none focus-visible:ring-2',
        isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/50 hover:bg-muted/40',
      )}
    >
      <CardHeader className='flex flex-row items-start gap-3 p-0'>
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors',
            isSelected
              ? 'border-primary/30 bg-primary text-primary-foreground'
              : 'border-border bg-background text-muted-foreground group-hover:border-primary/40 group-hover:text-foreground',
          )}
        >
          <Icon />
        </div>

        <div className='min-w-0 flex-1'>
          <CardTitle className='text-base'>{label}</CardTitle>
          <CardDescription className='mt-1 text-xs leading-5'>{description}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className='mt-auto flex items-center justify-between p-0'>
        <span className='text-muted-foreground text-xs font-medium'>{role}</span>

        <span
          className={cn(
            'flex size-6 items-center justify-center rounded-full border transition-colors',
            isSelected
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background text-transparent',
          )}
        >
          <Check />
        </span>
      </CardContent>
    </Card>
  );
});

RoleOptionCard.displayName = 'RoleOptionCard';

const SelectRoles = () => {
  const { t } = useTranslation(['common', 'staff']);
  const userId = useSelectRolesStore((state) => state.userId);
  const setUserId = useSetUserIdStore();
  const schoolId = useCurrentSchoolId();

  const isOpen = userId !== null;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<Set<UserRole>>(new Set());

  const rolesQueryKey = useMemo(() => ['user', userId, 'roles'], [userId]);

  const { data: rolesData, isLoading } = useQuery({
    queryKey: rolesQueryKey,
    queryFn: () => userService.getUserRoles({ userId: userId!, schoolId }),
    enabled: !!userId,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!userId) {
      setSelectedRoles(new Set());
      return;
    }

    setSelectedRoles(new Set(rolesData?.data.map(({ role }) => role) ?? []));
  }, [rolesData, userId]);

  const { mutateAsync: updateRoles, isPending } = useMutation({
    mutationFn: (data: UpdateUserRolesReq) =>
      userService.updateUserRoles({
        userId: userId!,
        schoolId,
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesQueryKey });
      queryClient.invalidateQueries({ queryKey: ['users'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['staff'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['parent'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['teachers'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['students'], exact: false });

      setUserId(null);
    },
  });

  const { mutateAsync: deleteUser, isPending: deleteUserPending } = useMutation({
    mutationFn: () =>
      userService.deleteUser({
        userId: userId!,
        schoolId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesQueryKey });
      queryClient.invalidateQueries({ queryKey: ['users'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['staff'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['parent'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['teachers'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['students'], exact: false });

      setDeleteDialogOpen(false);
      setUserId(null);
    },
  });

  const handleCancel = useCallback(() => {
    setDeleteDialogOpen(false);
    setUserId(null);
  }, [setUserId]);

  const handleDeleteAccount = useCallback(
    async (event: MouseEvent) => {
      event.preventDefault();

      try {
        await deleteUser();
        toast.success(t('staff:messages.user_deleted'));
      } catch {
        toast.error(t('staff:messages.delete_failed'));
      }
    },
    [deleteUser, t],
  );

  const submitRoles = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        await updateRoles({
          roles: Array.from(selectedRoles),
        });

        toast.success(t('staff:messages.update_success'));
      } catch {
        toast.error(t('staff:messages.update_failed'));
      }
    },
    [selectedRoles, updateRoles, t],
  );

  const toggleRole = useCallback((role: UserRole) => {
    setSelectedRoles((current) => {
      const next = new Set(current);

      if (next.has(role)) {
        next.delete(role);
      } else {
        next.add(role);
      }

      return next;
    });
  }, []);

  const roleCards = useMemo(
    () =>
      ROLE_CARDS.map((roleCard) => (
        <RoleOptionCard
          key={roleCard.role}
          role={roleCard.role}
          icon={roleCard.icon}
          label={t(`staff:${roleCard.labelKey}`)}
          description={t(`staff:${roleCard.descriptionKey}`)}
          isSelected={selectedRoles.has(roleCard.role)}
          onToggle={toggleRole}
        />
      )),
    [selectedRoles, toggleRole, t],
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className='overflow-hidden p-0 sm:max-w-2xl'>
        <form onSubmit={submitRoles}>
          <div className='bg-background'>
            <DialogHeader className='border-border border-b px-6 py-5'>
              <DialogTitle>{t('staff:dialog.title')}</DialogTitle>
              <DialogDescription>{t('staff:dialog.description')}</DialogDescription>
            </DialogHeader>

            <div className='flex flex-col gap-4 px-6 py-6'>
              {isLoading ? (
                <div className='border-border bg-muted/30 flex min-h-44 items-center justify-center rounded-lg border border-dashed'>
                  <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                    <Loader2 className='animate-spin' />
                    {t('staff:dialog.loading')}
                  </div>
                </div>
              ) : (
                <div className='grid gap-3 sm:grid-cols-2'>{roleCards}</div>
              )}
            </div>

            <div className='border-border bg-muted/20 border-t px-6 py-4'>
              <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button type='button' variant='destructive' disabled={deleteUserPending}>
                    <Trash2 data-icon='inline-start' />
                    {t('staff:actions.delete_account')}
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('staff:delete_confirm.title')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('staff:delete_confirm.description')}</AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteUserPending}>{t('staff:actions.cancel')}</AlertDialogCancel>

                    <AlertDialogAction
                      type='button'
                      variant='destructive'
                      onClick={handleDeleteAccount}
                      disabled={deleteUserPending}
                    >
                      {deleteUserPending && <Loader2 data-icon='inline-start' className='animate-spin' />}
                      {t('staff:actions.delete_account')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <DialogFooter className='border-border border-t px-6 py-4'>
              <Button type='button' variant='outline' onClick={handleCancel} disabled={isPending || deleteUserPending}>
                {t('staff:actions.cancel')}
              </Button>

              <Button type='submit' disabled={isPending || deleteUserPending}>
                {isPending && <Loader2 data-icon='inline-start' className='animate-spin' />}
                {t('staff:actions.confirm')}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SelectRoles;
