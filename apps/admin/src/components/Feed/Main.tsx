import BreadcrumbHeader from '@/pages/Header';
import { Button } from '../ui/button';
import { Card, CardAction, CardContent, CardHeader } from '../ui/card';
import { useSelectedRow } from './context/selected-row-provider';
import { TableData } from './core/core';
import FeedArea from './FeedArea';
import DialogContainer from './dialogs/DialogContainer';

const Main = () => {
  const { handleDialogStateChange } = useSelectedRow();

  return (
    <div>
      <BreadcrumbHeader breadcrumbs={[{ title: TableData.MainCard.title, href: TableData.href }]} />
      <div className='mx-auto w-full px-8'>
        <Card>
          <CardHeader>
            <CardAction>
              <Button
                onClick={() => {
                  handleDialogStateChange({ openDialog: 'add' });
                }}
              >
                {TableData.MainCard.addButton.label}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <FeedArea />
            <DialogContainer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Main;
