import { ApiError } from '@/api/ApiError';
import { parentStudentService } from '@/api/service/parentStudentService';
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
import queryClient from '@/config/react-qeury';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const UnassignParentDialog = (params: { studentId: string; parentId: string; handleCancel: () => void }) => {
  const { studentId, parentId, handleCancel } = params;
  const schoolId = useCurrentSchoolId();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => parentStudentService.unassignStudentFromParent({ studentId, parentId, schoolId }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', studentId], exact: false });
      queryClient.invalidateQueries({ queryKey: ['parents', parentId], exact: false });
    },
  });

  const handleDelete = async () => {
    try {
      await mutateAsync();
      toast.success(`Parent unassigned successfully`);
      handleCancel();
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        toast.error('Parent unassignment failed');
      } else {
        toast.error(`Failed to unassign parent`);
      }

      handleCancel();
    }
  };
  return (
    <>
      <AlertDialog open={true} onOpenChange={handleCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unassign Parent</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to unassign this parent?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel} disabled={isPending}>
              Cancel
            </AlertDialogCancel>
            <Button onClick={handleDelete} disabled={isPending} className='bg-red-600 hover:bg-red-500'>
              {isPending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : 'Unassign'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UnassignParentDialog;
