import { SelectedRowProvider } from './context/selected-row-provider';
import Main from './Main';

const ParentsIndex = () => {
  return (
    <SelectedRowProvider>
      <Main />
    </SelectedRowProvider>
  );
};

export default ParentsIndex;
