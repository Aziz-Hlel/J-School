import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BreadcrumbHeader from '@/pages/Header';
import { useTranslation } from 'react-i18next';
import AddStudent from '../student-profile/components/add-student';
import MainTable from './Table';
import { TableData } from './core/core';
import DialogContainer from './dialogs/DialogContainer';

const Main = () => {
  const { t } = useTranslation(['studentProfile']);

  return (
    <div>
      <BreadcrumbHeader breadcrumbs={[{ title: t('studentProfile:list.title'), href: TableData.href }]} />
      <div className='mx-auto w-full'>
        <Card>
          <CardHeader>
            <CardTitle>{t('studentProfile:list.title')}</CardTitle>
            <CardDescription>{t('studentProfile:list.description')}</CardDescription>
            <CardAction>
              <AddStudent>
                <Button>{t('studentProfile:list.actions.add')}</Button>
              </AddStudent>
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
