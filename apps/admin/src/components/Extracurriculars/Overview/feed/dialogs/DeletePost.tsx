import { extraCurricularService } from '@/api/service/extracurricularsService';
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
import { useParams } from 'react-router';
import { toast } from 'sonner';

const DeletePost = ({ postId, setIsDeleteOpen }: { postId: string; setIsDeleteOpen: () => void }) => {
  const queryClient = useQueryClient();
  const schoolId = useCurrentSchoolId();
  const { extraCurricularId: id } = useParams();
  const extraCurricularId = id!;

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['extra-curriculars', extraCurricularId, 'posts', postId, 'delete'],
    mutationFn: extraCurricularService.post.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extra-curriculars', extraCurricularId, 'posts'], exact: false });
      setIsDeleteOpen();
    },
  });

  const handleDelete = async () => {
    try {
      await mutateAsync({ schoolId, extraCurricularId, postId });
      toast.success(`Post deleted successfully`);
      setIsDeleteOpen();
    } catch {
      toast.error(`Failed to delete post`);
      setIsDeleteOpen();
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={setIsDeleteOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete post</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to delete this post?</AlertDialogDescription>
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

export default DeletePost;
