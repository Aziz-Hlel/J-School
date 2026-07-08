import { SelectedRowProvider } from './context/selected-row-provider';
import Main from './Main';

const ExtracurricularsIndex = () => {
  return (
    <SelectedRowProvider>
      <Main />
    </SelectedRowProvider>
  );
};

export default ExtracurricularsIndex;
