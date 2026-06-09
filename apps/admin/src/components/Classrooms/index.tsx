import { SelectedRowProvider } from './context/selected-row-provider';
import Main from './Main';

const ClassroomsIndex = () => {
  return (
    <SelectedRowProvider>
      <Main />
    </SelectedRowProvider>
  );
};

export default ClassroomsIndex;
