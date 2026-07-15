import EditTeacher from '../../student-profile/components/edit-teacher';
import { useSelectedRow } from '../context/selected-row-provider';
import ChangePassword from './change-password/ChangePassword';
import CreateDialog from './create/CreateDialog';
import DeleteDialog from './delete/DeleteDialog';

const DialogContainer = () => {
  const { dialogState } = useSelectedRow();
  return (
    <>
      {dialogState.openDialog === 'edit' && <EditTeacher />}
      {dialogState.openDialog === 'add' && <CreateDialog />}
      {dialogState.openDialog === 'delete' && <DeleteDialog />}
      {dialogState.openDialog === 'change-password' && <ChangePassword />}
    </>
  );
};

export default DialogContainer;
