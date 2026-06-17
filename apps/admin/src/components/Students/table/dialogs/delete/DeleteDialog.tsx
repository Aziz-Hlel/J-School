import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { useSelectedRow } from '../../context/selected-row-provider';
import DeleteDialogView from './DeleteDialogView';

const DeleteDialog = () => {
  const { handleCancel, dialogState } = useSelectedRow();

  const dialogOpen = dialogState.openDialog === 'delete';

  return (
    <AlertDialog open={dialogOpen} onOpenChange={handleCancel}>
      <AlertDialogContent>
        {dialogOpen && <DeleteDialogView selectedRow={dialogState.selectedRow} />}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
