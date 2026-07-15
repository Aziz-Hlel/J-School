import { useSelectedRow } from '../context/selected-row-provider';
import ChangePassword from './change-password/ChangePassword';
import CreateDialog from './create/CreateDialog';
import DeleteDialog from './delete/DeleteDialog';
import UpdateDialog from './update/UpdateDialog';

const DialogContainer = () => {
  const { dialogState } = useSelectedRow();
  return (
    <>
      {dialogState.openDialog === 'edit' && <UpdateDialog />}
      {dialogState.openDialog === 'add' && <CreateDialog />}
      {dialogState.openDialog === 'delete' && <DeleteDialog />}
      {dialogState.openDialog === 'change-password' && <ChangePassword />}
    </>
  );
};

export default DialogContainer;
