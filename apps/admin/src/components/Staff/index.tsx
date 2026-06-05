import { SelectedRowProvider } from './context/selected-row-provider';
import Main from './Main';

const StaffIndex = () => {
  return (
    <SelectedRowProvider>
      <Main />
    </SelectedRowProvider>
  );
};

export default StaffIndex;
