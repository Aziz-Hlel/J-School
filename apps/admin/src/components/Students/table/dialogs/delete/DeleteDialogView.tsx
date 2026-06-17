import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useSelectedRow } from '../../context/selected-row-provider';
import { TableData } from '../../core/core';
import type { TableRowType } from '../../core/types';
import useDelete from './useDelete';

type Props = {
  selectedRow: TableRowType;
};

const DeleteDialogView = ({ selectedRow }: Props) => {
  const { handleDelete, isPending } = useDelete({ selectedRow });
  const { handleCancel } = useSelectedRow();
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>{TableData.DeleteDialog.title}</AlertDialogTitle>
        <AlertDialogDescription>{TableData.DeleteDialog.description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={handleCancel} disabled={isPending}>
          {TableData.DeleteDialog.buttons.cancel}
        </AlertDialogCancel>
        <Button onClick={handleDelete} disabled={isPending} className='bg-red-600 hover:bg-red-500'>
          {TableData.DeleteDialog.buttons.submit}
        </Button>
      </AlertDialogFooter>
    </>
  );
};

export default DeleteDialogView;
