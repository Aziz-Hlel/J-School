import { examSchedulesService } from '@/api/service/examService';
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

const DeleteScheduleExam = ({
  examId,
  classroomId,
  setIsDeleteOpen,
}: {
  examId: string;
  classroomId: string;
  setIsDeleteOpen: () => void;
}) => {
  const queryClient = useQueryClient();
  const schoolId = useCurrentSchoolId();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['examSchedules', 'delete', examId],
    mutationFn: () => examSchedulesService.delete({ schoolId, examScheduleId: examId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms', classroomId, 'exams'], exact: false });
    },
  });

  const handleDelete = async () => {
    try {
      await mutateAsync();
      toast.success(`Exam schedule deleted successfully`);
      setIsDeleteOpen();
    } catch {
      toast.error(`Failed to delete exam schedule`);

      setIsDeleteOpen();
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={setIsDeleteOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Exam Schedule</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to delete this exam schedule?</AlertDialogDescription>
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

export default DeleteScheduleExam;
