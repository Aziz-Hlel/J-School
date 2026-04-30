import ENV from './config/env';
import { createExpressApp } from './app/app';
import asyncBootstrapHandlers from './bootstrap/bootstraps';

async function bootstrap() {
  await asyncBootstrapHandlers();

  const app = createExpressApp();
  app.on('mount', (error) => {
    console.error('❌ ERROR : Server failed to start', error);
    process.exit(1);
  });
  app.listen(ENV.API_PORT, () => {
    console.log(`✅ SUCCESS : Server running on port ${ENV.API_PORT}`);
  });
}

bootstrap();
