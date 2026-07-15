import { SelectedRowProvider } from './context/selected-row-provider';
import Main from './Main';

const TeacherHomeworkIndex = () => {
  return (
    <SelectedRowProvider>
      <Main />
    </SelectedRowProvider>
  );
};

export default TeacherHomeworkIndex;
