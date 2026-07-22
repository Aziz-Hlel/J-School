import BreadcrumbHeader from '@/pages/Header';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import MainTable from './Table';
import { useSelectedRow } from './context/selected-row-provider';
import { TableData } from './core/core';
import DialogContainer from './dialogs/DialogContainer';

const Main = () => {
  const { t } = useTranslation(['extracurriculars']);
  const { handleDialogStateChange } = useSelectedRow();

  return (
    <div>
      <BreadcrumbHeader breadcrumbs={[{ title: t('extracurriculars:main.title'), href: TableData.href }]} />
      <div className='mx-auto w-full'>
        <Card>
          <CardHeader>
            <CardTitle>{t('extracurriculars:main.title')}</CardTitle>
            <CardDescription>{t('extracurriculars:main.description')}</CardDescription>
            <CardAction>
              <Button onClick={() => handleDialogStateChange({ openDialog: 'add' })}>
                {t('extracurriculars:main.add_button')}
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
