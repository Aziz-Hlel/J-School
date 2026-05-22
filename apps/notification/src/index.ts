import { NotificationModule } from './notification.module';

const init = async () => {
  const { workers: notificationWorkers } = NotificationModule();

  const workers = [...notificationWorkers];

  process.on('SIGINT', async () => {
    await Promise.all(workers.map((w) => w.close()));
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await Promise.all(workers.map((w) => w.close()));
    process.exit(0);
  });

  console.log('✅ SUCCESS : Workers are running');
};

init();
