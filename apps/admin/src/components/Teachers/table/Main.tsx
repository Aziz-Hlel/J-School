import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BreadcrumbHeader from '@/pages/Header';
import { useTranslation } from 'react-i18next';
import AddTeacher from '../student-profile/components/add-teacher';
import MainTable from './Table';
import { TableData } from './core/core';
import DialogContainer from './dialogs/DialogContainer';

const Main = () => {
  const { t } = useTranslation(['teachers']);

  return (
    <div>
      <BreadcrumbHeader breadcrumbs={[{ title: t('teachers:main.title'), href: TableData.href }]} />
      <div className='mx-auto w-full'>
        <Card>
          <CardHeader>
            <CardTitle>{t('teachers:main.title')}</CardTitle>
            <CardDescription>{t('teachers:main.description')}</CardDescription>
            <CardAction>
              <AddTeacher>
                <Button>{t('teachers:main.addButton')}</Button>
              </AddTeacher>
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
