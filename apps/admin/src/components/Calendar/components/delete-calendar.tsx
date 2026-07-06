import { calendarService } from '@/api/service/calendarService';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const DeleteCalendar = ({ calendarId, setIsDeleteOpen }: { calendarId: string; setIsDeleteOpen: () => void }) => {
  const queryClient = useQueryClient();
  const schoolId = useCurrentSchoolId();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['calendar', 'delete'],
    mutationFn: () => calendarService.deleteCalendar(schoolId, calendarId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'], exact: false });
    },
  });

  const handleDelete = async () => {
    try {
      await mutateAsync();
      toast.success(`Fee cycle deleted successfully`);
      setIsDeleteOpen();
    } catch {
      toast.error(`Failed to delete fee cycle`);

      setIsDeleteOpen();
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={setIsDeleteOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Fee</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to delete this fee cycle?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={setIsDeleteOpen} disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <Button onClick={handleDelete} disabled={isPending} className='bg-red-600 hover:bg-red-500'>
            Delete
          </Button>
        </AlertDialogFooter>{' '}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCalendar;
