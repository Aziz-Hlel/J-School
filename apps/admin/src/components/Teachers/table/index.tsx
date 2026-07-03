import { SelectedRowProvider } from './context/selected-row-provider';
import Main from './Main';

const TeachersIndex = () => {
  return (
    <SelectedRowProvider>
      <Main />
    </SelectedRowProvider>
  );
};

export default TeachersIndex;
