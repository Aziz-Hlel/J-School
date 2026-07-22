import BreadcrumbHeader from '@/pages/Header';
import { useTranslation } from 'react-i18next'; // 1. Import du hook
import { Button } from '../ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import MainTable from './Table';
import { useSelectedRow } from './context/selected-row-provider';
import DialogContainer from './dialogs/DialogContainer';

const Main = () => {
  const { t } = useTranslation(['staff']); // 2. Initialisation
  const { handleDialogStateChange } = useSelectedRow();

  return (
    <div>
      {/* 3. Utilisation des clés pour le fil d'Ariane et le contenu du tableau */}
      <BreadcrumbHeader breadcrumbs={[{ title: t('staff:main_card.title'), href: '/staff' }]} />
      <div className='mx-auto w-full'>
        <Card>
          <CardHeader>
            <CardTitle>{t('staff:main_card.title')}</CardTitle>
            <CardDescription>{t('staff:main_card.description')}</CardDescription>
            <CardAction>
              <Button onClick={() => handleDialogStateChange({ openDialog: 'add' })}>
                {t('staff:main_card.add_button')}
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
