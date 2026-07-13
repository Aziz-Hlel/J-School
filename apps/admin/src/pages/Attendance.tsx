import AdminAttendanceOverview from '@/components/Attendance/admin-attendance';
import TeacherAttendanceOverview from '@/components/Attendance/teacher-attendance';
import { useIsCurrentUserAdmin } from '@/hooks/useIsCurrentUserAdmin';

const Attendance = () => {
  const isAdmin = useIsCurrentUserAdmin();

  if (isAdmin) {
    return <AdminAttendanceOverview />;
  }

  return <TeacherAttendanceOverview />;
};

export default Attendance;
