import { ApiError } from '@/api/ApiError';
import { feesItemsService } from '@/api/service/feesItemsService';
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

const DeleteFeeItem = ({
  studentId,
  feeId,
  itemId,
  setIsDeleteOpen,
}: {
  studentId: string;
  feeId: string;
  itemId: string;
  setIsDeleteOpen: () => void;
}) => {
  const queryClient = useQueryClient();
  const schoolId = useCurrentSchoolId();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['students', studentId, 'fees', feeId, 'items', 'delete'],
    mutationFn: () => feesItemsService.delete(schoolId, feeId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['students', studentId, 'fees'],
        exact: false,
      });
    },
  });

  const handleDelete = async () => {
    try {
      await mutateAsync();
      toast.success('Fee item deleted successfully');
      setIsDeleteOpen();
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        toast.error('Fee item cannot be deleted');
      } else {
        toast.error('Failed to delete fee item');
      }
      setIsDeleteOpen();
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={setIsDeleteOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Fee Item</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this fee item? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={setIsDeleteOpen} disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <Button onClick={handleDelete} disabled={isPending} className='bg-red-600 hover:bg-red-500'>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteFeeItem;
