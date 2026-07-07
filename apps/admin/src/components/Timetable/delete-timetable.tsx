import { classroomsService } from '@/api/service/classroomsService';
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

const DeleteTimetable = ({
  classroomId,
  timetableId,
  setIsDeleteOpen,
}: {
  classroomId: string;
  timetableId: string;
  setIsDeleteOpen: () => void;
}) => {
  const queryClient = useQueryClient();
  const schoolId = useCurrentSchoolId();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['classrooms', classroomId, 'timetable', timetableId, 'delete'],
    mutationFn: classroomsService.deleteTimetable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms', classroomId, 'timetable'], exact: false });
    },
  });

  const handleDelete = async () => {
    try {
      await mutateAsync({ schoolId, classroomId, timetableId });
      toast.success(`Session deleted successfully`);
      setIsDeleteOpen();
    } catch {
      toast.error(`Failed to delete session`);
      setIsDeleteOpen();
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={setIsDeleteOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete timetable</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to delete this session?</AlertDialogDescription>
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

export default DeleteTimetable;
