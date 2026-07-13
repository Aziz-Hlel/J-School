import ExtracurricularsIndex from '@/components/Extracurriculars';
import TeacherExtraCurricularDisplay from '@/components/Extracurriculars/teacher/TeacherDisplay';
import { useIsCurrentUserAdmin } from '@/hooks/useIsCurrentUserAdmin';

const Extracurriculars = () => {
  const isAdmin = useIsCurrentUserAdmin();

  if (isAdmin) return <ExtracurricularsIndex />;

  return <TeacherExtraCurricularDisplay />;
};

export default Extracurriculars;
