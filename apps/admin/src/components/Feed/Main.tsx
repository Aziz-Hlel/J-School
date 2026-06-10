import BreadcrumbHeader from '@/pages/Header';
import { Button } from '../ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { TableData } from './core/core';
import FeedArea from './FeedArea';

const Main = () => {
  return (
    <div>
      <BreadcrumbHeader breadcrumbs={[{ title: TableData.MainCard.title, href: TableData.href }]} />
      <div className='mx-auto w-full'>
        <Card>
          <CardHeader>
            <CardTitle>{TableData.MainCard.title}</CardTitle>
            <CardDescription>{TableData.MainCard.description}</CardDescription>
            <CardAction>
              <Button onClick={() => {}}>{TableData.MainCard.addButton.label}</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <FeedArea />
            {/* <MainTable /> */}
            {/* <DialogContainer /> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Main;
