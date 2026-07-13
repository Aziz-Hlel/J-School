import { SelectedRowProvider } from './context/selected-row-provider';
import Main from './Main';

const AdminTeacherCommentsIndex = () => {
  return (
    <SelectedRowProvider>
      <Main />
    </SelectedRowProvider>
  );
};

export default AdminTeacherCommentsIndex;
