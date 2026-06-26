import { ApiError } from '@/api/ApiError';
import { feedService } from '@/api/service/feedService';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import type { FeedResponse } from '@repo/contracts/schemas/Feed/response';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSelectedRow } from '../../context/selected-row-provider';
import { TableData } from '../../core/core';

const useDelete = ({ selectedRow }: { selectedRow: FeedResponse }) => {
  const queryClient = useQueryClient();
  const { handleCancel } = useSelectedRow();
  const schoolId = useCurrentSchoolId();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['feed', 'delete'],
    mutationFn: feedService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TableData.MODULE_NAME], exact: false });
    },
  });

  const handleDelete = async () => {
    try {
      await mutateAsync({ id: selectedRow.id, schoolId });
      toast.success(`${TableData.ModuleName} deleted successfully`);
      handleCancel();
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        toast.error('Weekly events cannot be deleted');
      } else {
        toast.error(`Failed to delete ${TableData.ModuleName}`);
      }

      handleCancel();
    }
  };

  return { handleDelete, isPending };
};

export default useDelete;
