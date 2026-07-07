import type { ClassroomExamScheduleResponse } from '@repo/contracts/schemas/classroom/management/ClassroomExamSchedulesResponse';

const EditExamSchedule = ({
  classroomId,
  exam,
  setIsEditOpen,
}: {
  classroomId: string;
  exam: ClassroomExamScheduleResponse;
  setIsEditOpen: (open: boolean) => void;
}) => {
  return <div>EditExamSchedule</div>;
};

export default EditExamSchedule;
