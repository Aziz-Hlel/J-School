import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useSelectedRow } from '../../context/selected-row-provider';
import UpdateDialogInner from './UpdateDialogInner';
import { TableData } from '../../core/core';

const UpdateDialog = () => {
  const { handleCancel, dialogState } = useSelectedRow();

  const onOpenChange = (open: boolean) => {
    if (!open) {
      handleCancel();
    }
  };

  const dialogIsOpen = dialogState.openDialog === 'edit';

  return (
    <Dialog onOpenChange={onOpenChange} open={dialogIsOpen}>
      <DialogContent className='flex h-[calc(100dvh-4rem)] flex-col overflow-hidden sm:max-w-106.25'>
        <DialogHeader>
          <DialogTitle className='text-center'>{TableData.EditDialog.title}</DialogTitle>
          <DialogDescription className='text-center'>{TableData.EditDialog.description}</DialogDescription>
          <Separator />
        </DialogHeader>
        {dialogIsOpen && <UpdateDialogInner selectedRow={dialogState.selectedRow} />}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDialog;
