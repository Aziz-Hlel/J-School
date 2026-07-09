import { SelectedRowProvider } from './context/selected-row-provider';
import Main from './Main';

const TeacherCommentsIndex = () => {
  return (
    <SelectedRowProvider>
      <Main />
    </SelectedRowProvider>
  );
};

export default TeacherCommentsIndex;
