import AdminTimetable from '@/components/Timetable/AdminTimetable';
import TeacherTimetable from '@/components/Timetable/teacherTimetable';
import { useIsCurrentUserAdmin } from '@/hooks/useIsCurrentUserAdmin';

const Timetable = () => {
  const isAdmin = useIsCurrentUserAdmin();

  if (isAdmin) {
    return <AdminTimetable />;
  }

  return <TeacherTimetable />;
};

export default Timetable;
