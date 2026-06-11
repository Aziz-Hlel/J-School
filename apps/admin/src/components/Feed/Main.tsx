import BreadcrumbHeader from '@/pages/Header';
import { Button } from '../ui/button';
import { Card, CardAction, CardContent, CardHeader } from '../ui/card';
import { TableData } from './core/core';
import FeedArea from './FeedArea';

const Main = () => {
  return (
    <div>
      <BreadcrumbHeader breadcrumbs={[{ title: TableData.MainCard.title, href: TableData.href }]} />
      <div className='mx-auto w-full px-8'>
        <Card>
          <CardHeader>
            <CardAction>
              <Button onClick={() => {}}>{TableData.MainCard.addButton.label}</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <FeedArea />
            {/* <DialogContainer /> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Main;
