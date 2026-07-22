import BreadcrumbHeader from '@/pages/Header';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import MainTable from './Table';
import { TableData } from './core/core';
import DialogContainer from './dialogs/DialogContainer';

const Main = () => {
  const { t } = useTranslation(['homeworks']);

  return (
    <div>
      <BreadcrumbHeader breadcrumbs={[{ title: t('mainCard.title'), href: TableData.href }]} />
      <div className='mx-auto w-full'>
        <Card>
          <CardHeader>
            <CardTitle>{t('mainCard.title')}</CardTitle>
            <CardDescription>{t('mainCard.description')}</CardDescription>
            {/* <CardAction>
              <Button onClick={() => handleDialogStateChange({ openDialog: 'add' })}>
                {t('mainCard.addButton')}
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
