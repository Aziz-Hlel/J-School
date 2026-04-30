import { StudentProfileController } from './studentProfile.controller';
import { StudentProfileRepo } from './studentProfile.repo';
import { createRouter } from './studentProfile.route';
import { StudentProfileService } from './studentProfile.service';

export const StudentProfileModule = () => {
  const studentProfileRepo = new StudentProfileRepo();
  const studentProfileService = new StudentProfileService(studentProfileRepo);
  const studentProfileController = new StudentProfileController(studentProfileService);
  const studentProfileRouter = createRouter(studentProfileController);
  return { studentProfileService, studentProfileRouter };
};
