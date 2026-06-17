import { useSelectedRow } from '../context/selected-row-provider';
import CreateFeed from './CreateFeed';
import DeleteDialog from './delete/DeleteDialog';
import UpdateFeed from './UpdateFeed';
// import DeleteDialog from './delete/DeleteDialog';
// import UpdateDialog from './update/UpdateDialog';

const DialogContainer = () => {
  const { dialogState } = useSelectedRow();
  console.log('dialogState.openDialog', dialogState.openDialog);
  return (
    <>
      {dialogState.openDialog === 'edit' && <UpdateFeed />}
      {dialogState.openDialog === 'add' && <CreateFeed />}
      {dialogState.openDialog === 'delete' && <DeleteDialog />}
    </>
  );
};

export default DialogContainer;
