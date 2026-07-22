import BreadcrumbHeader from '@/pages/Header';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Card, CardAction, CardContent, CardHeader } from '../ui/card';
import { useSelectedRow } from './context/selected-row-provider';
import { TableData } from './core/core';
import DialogContainer from './dialogs/DialogContainer';
import FeedArea from './FeedArea';

const Main = () => {
  const { t } = useTranslation(['feed']);
  const { handleDialogStateChange } = useSelectedRow();

  return (
    <div>
      <BreadcrumbHeader breadcrumbs={[{ title: t('mainCard.title'), href: TableData.href }]} />
      <div className='mx-auto w-full px-8'>
        <Card>
          <CardHeader>
            <CardAction>
              <Button
                onClick={() => {
                  handleDialogStateChange({ openDialog: 'add' });
                }}
              >
                {t('mainCard.addButton')}
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
