import seed from '@/seeds';
import { testDbConnection } from './test-connection/db.test.connection';
import testEmailTransporterConnection from './test-connection/email.test.connection';
import testFirebaseConnection from './test-connection/firebase.test.connection';
import { storageProviderTestConnection } from './test-connection/storageProvider.test.connection';

const asyncBootstrapHandlers = async () => {
  await Promise.all([
    testFirebaseConnection(),
    testDbConnection(),
    storageProviderTestConnection(),
    testEmailTransporterConnection(),
  ]);
  //
  await seed();
};

export default asyncBootstrapHandlers;
