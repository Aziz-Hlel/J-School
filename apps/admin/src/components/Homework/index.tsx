import { SelectedRowProvider } from './context/selected-row-provider';
import Main from './Main';

const HomeworkIndex = () => {
  return (
    <SelectedRowProvider>
      <Main />
    </SelectedRowProvider>
  );
};

export default HomeworkIndex;
