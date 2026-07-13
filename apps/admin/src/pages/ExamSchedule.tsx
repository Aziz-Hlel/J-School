import AdminExamScheduleOverview from '@/components/ExamSchedule/AdminExamSchedule';
import TeacherExamScheduleOverview from '@/components/ExamSchedule/TeacherExamSchedule';
import { useIsCurrentUserAdmin } from '@/hooks/useIsCurrentUserAdmin';

const ExamSchedule = () => {
  const isAdmin = useIsCurrentUserAdmin();

  if (isAdmin) {
    return <AdminExamScheduleOverview />;
  }

  return <TeacherExamScheduleOverview />;
};
export default ExamSchedule;
