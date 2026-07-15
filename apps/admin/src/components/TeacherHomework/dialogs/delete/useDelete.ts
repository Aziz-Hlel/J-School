import { ApiError } from '@/api/ApiError';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSelectedRow } from '../../context/selected-row-provider';
import { TableData } from '../../core/core';
import { operations } from '../../core/services';
import type { TableRowType } from '../../core/types';

const useDelete = ({ selectedRow }: { selectedRow: TableRowType }) => {
  const queryClient = useQueryClient();
  const { handleCancel } = useSelectedRow();
  const schoolId = useCurrentSchoolId();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: operations.delete.mutationKey(),
    mutationFn: operations.delete.fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TableData.MODULE_NAME], exact: false });
    },
  });

  const handleDelete = async () => {
    try {
      await mutateAsync({ schoolId, homeworkId: selectedRow.id });
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
