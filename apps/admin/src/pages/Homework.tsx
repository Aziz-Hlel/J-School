import HomeworkIndex from '@/components/Homework';
import TeacherHomeworkIndex from '@/components/TeacherHomework';
import { useIsCurrentUserAdmin } from '@/hooks/useIsCurrentUserAdmin';

const Homework = () => {
  const isAdmin = useIsCurrentUserAdmin();

  if (isAdmin) {
    return <HomeworkIndex />;
  }

  return <TeacherHomeworkIndex />;
};

export default Homework;
