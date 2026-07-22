import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { useSelectedRow } from '../../context/selected-row-provider';
import UpdateDialogInner from './UpdateDialogInner';

const UpdateDialog = () => {
  const { t } = useTranslation(['classrooms']);
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
          <DialogTitle className='text-center'>{t('classrooms:updateDialog.title')}</DialogTitle>
          <DialogDescription className='text-center'>{t('classrooms:updateDialog.description')}</DialogDescription>
          <Separator />
        </DialogHeader>
        {dialogIsOpen && <UpdateDialogInner selectedRow={dialogState.selectedRow} />}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDialog;
