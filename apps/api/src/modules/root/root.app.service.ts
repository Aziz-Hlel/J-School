import { execSync } from 'child_process';
import { firebaseUserService } from '@/firebase/service/firebase.user.service';

export class RootAppService {
  resetAuthAndDB = async () => {
    await firebaseUserService.deleteAllUsers();

    execSync('npx prisma db push --force-reset', {
      stdio: 'inherit',
    });
  };
}
