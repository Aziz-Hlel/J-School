import userService from '@/api/service/userService';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { UserRole } from '@repo/contracts/types/enums/enums';
import { useQuery } from '@tanstack/react-query';
import { useSelectRolesStore, useSetUserId } from './select-roles-store';

const SelectRoles = () => {
  const userId = useSelectRolesStore((state) => state.userId);
  const isOpen = userId !== null;
  const setUserId = useSetUserId();

  const handleCancel = () => {
    setUserId(null);
  };

  const { data: rolesData } = useQuery({
    queryKey: ['user', userId, 'roles'],
    queryFn: () => userService.getUserRoles({ userId }),
  });

  const roles = rolesData?.data ?? [];

  const allRoles = UserRole;

  const handleAddRole = (role: UserRole) => {};

  const handleRemoveRole = (role: UserRole) => {};

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className='rounded-2xl sm:max-w-105'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-slate-800 dark:text-slate-100'>Select Students</DialogTitle>
          <DialogDescription>Select students for the classroom.</DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-6'>
          <div className='space-y-2'>
            <Label htmlFor='classroom-select' className='font-semibold text-slate-700 dark:text-slate-300'>
              Classrooms
            </Label>
          </div>
        </div>
        <DialogFooter className='gap-2 sm:gap-0'>
          <Button
            variant='outline'
            className='rounded-xl border-slate-200 dark:border-zinc-800'
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button className='bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl' onClick={handleUpdate}>
            Delete Acccount
          </Button>
          <Button className='bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl' onClick={handleUpdate}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectRoles;
