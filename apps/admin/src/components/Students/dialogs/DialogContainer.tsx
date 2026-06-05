import CreateDialog from './create/CreateDialog';
import DeleteDialog from './delete/DeleteDialog';
import UpdateDialog from './update/UpdateDialog';
import { useSelectedRow } from '../context/selected-row-provider';

const DialogContainer = () => {
  const { dialogState } = useSelectedRow();
  return (
    <>
      {dialogState.openDialog === 'edit' && <UpdateDialog />}
      {dialogState.openDialog === 'add' && <CreateDialog />}
      {dialogState.openDialog === 'delete' && <DeleteDialog />}
    </>
  );
};

export default DialogContainer;
