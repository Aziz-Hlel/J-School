import BreadcrumbHeader from '@/pages/Header';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import MainTable from './Table';
import { TableData } from './core/core';
import DialogContainer from './dialogs/DialogContainer';

const Main = () => {
  const { t } = useTranslation(['comments']);

  return (
    <div>
      <BreadcrumbHeader breadcrumbs={[{ title: t('title'), href: TableData.href }]} />
      <div className='mx-auto w-full p-6'>
        <Card>
          <CardHeader>
            <CardTitle>{t('comments:title')}</CardTitle>
            <CardDescription>{t('comments:description')}</CardDescription>
            {/* <CardAction>
              <Button onClick={() => handleDialogStateChange({ openDialog: 'add' })}>
                {t('addButton')}
              </Button>
            </CardAction> */}
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
