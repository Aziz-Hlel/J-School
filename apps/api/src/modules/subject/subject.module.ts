import { SubjectController } from './subject.controller';
import { SubjectRepo } from './subject.repo';
import { createRouter } from './subject.route';
import { SubjectService } from './subject.service';
import { SubjectInternal } from './subject.internal';

export const SubjectModule = () => {
  const subjectRepo = new SubjectRepo();
  const subjectService = new SubjectService(subjectRepo);
  const subjectInternal = new SubjectInternal(subjectRepo);
  const subjectController = new SubjectController(subjectService);
  const subjectRouter = createRouter(subjectController);
  return {
    subjectRouter,
    subjectInternal,
  };
};
