import { ParentRepo } from './parent.repo';
import { ParentService } from './parent.service';

export const ParentModule = () => {
  const parentRepo = new ParentRepo();
  const parentService = new ParentService(parentRepo);
  return { parentService, parentRepo };
};
