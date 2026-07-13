import AdminTeacherCommentsIndex from '@/components/AdminTeacherComments';
import TeacherCommentsIndex from '@/components/TeacherComments';
import { useIsCurrentUserAdmin } from '@/hooks/useIsCurrentUserAdmin';

const AdminTeacherComments = () => {
  const isAdmin = useIsCurrentUserAdmin();

  if (isAdmin) {
    return <AdminTeacherCommentsIndex />;
  }

  return <TeacherCommentsIndex />;
};

export default AdminTeacherComments;
