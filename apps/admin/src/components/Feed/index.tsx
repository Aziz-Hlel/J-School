import Main from './Main';
import { SelectedRowProvider } from './context/selected-row-provider';

const FeedIndex = () => {
  return (
    <SelectedRowProvider>
      <Main />
    </SelectedRowProvider>
  );
};

export default FeedIndex;
