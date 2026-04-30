import { SchoolController } from './school.controller';
import { SchoolRepo } from './school.repo';
import { createSchoolRoute } from './school.route';
import { SchoolAppService } from './school.app.service';
import { SchoolService } from './school.service';
import { OwnerService } from '../owner/owner.service';

export const createSchoolModule = ({ ownerService }: { ownerService: OwnerService }) => {
  const repo = new SchoolRepo();
  const service = new SchoolService(repo, ownerService);
  const appService = new SchoolAppService(repo, service, ownerService);
  const controller = new SchoolController(appService);
  const schoolRouter = createSchoolRoute(controller);
  return { schoolRouter, schoolService: service };
};
