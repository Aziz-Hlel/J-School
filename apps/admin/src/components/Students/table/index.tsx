import { SelectedRowProvider } from './context/selected-row-provider';
import Main from './Main';

const StudentsIndex = () => {
  return (
    <SelectedRowProvider>
      <Main />
    </SelectedRowProvider>
  );
};

export default StudentsIndex;
