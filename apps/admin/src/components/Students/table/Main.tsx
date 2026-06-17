import BreadcrumbHeader from '@/pages/Header';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MainTable from './Table';
import { useSelectedRow } from './context/selected-row-provider';
import { TableData } from './core/core';
import DialogContainer from './dialogs/DialogContainer';
import { Button } from '@/components/ui/button';

const Main = () => {
  const { handleDialogStateChange } = useSelectedRow();
  return (
    <div>
      <BreadcrumbHeader breadcrumbs={[{ title: TableData.MainCard.title, href: TableData.href }]} />
      <div className='mx-auto w-full'>
        <Card>
          <CardHeader>
            <CardTitle>{TableData.MainCard.title}</CardTitle>
            <CardDescription>{TableData.MainCard.description}</CardDescription>
            <CardAction>
              <Button onClick={() => handleDialogStateChange({ openDialog: 'add' })}>
                {TableData.MainCard.addButton.label}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <MainTable />
            <DialogContainer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Main;
