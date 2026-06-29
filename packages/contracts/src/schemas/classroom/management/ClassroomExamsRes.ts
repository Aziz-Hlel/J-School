import type { LocalizedString } from '../../../jobs/notificationJob';

export type ClassroomExamsRes = {
  id: string;
  name: LocalizedString;
  assignmentId: string;
  subject: {
    id: string;
    name: LocalizedString;
  };
};
