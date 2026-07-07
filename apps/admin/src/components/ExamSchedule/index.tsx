import { classroomsService } from '@/api/service/classroomsService';
import schoolService from '@/api/service/schoolService';
import { Button } from '@/components/ui/button';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import BreadcrumbHeader from '@/pages/Header';
import type { ClassroomExamScheduleResponse } from '@repo/contracts/schemas/classroom/management/ClassroomExamSchedulesResponse';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import AddScheduleExam from './add-scheduleExam';
import DeleteScheduleExam from './delete-scheduleExam';
import EditExamSchedule from './edit-scheduleExam';

const ExamScheduleOverview = () => {
  const schoolId = useCurrentSchoolId();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [classroomId, setClassroomId] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<ClassroomExamScheduleResponse | null>(null);

  const { data: classroomsData } = useQuery({
    queryKey: ['classrooms', 'select'],
    queryFn: () => schoolService.selectClassrooms({ schoolId }),
  });
  const classrooms = classroomsData?.data ?? [];

  const { data: examsScheduleData, isLoading: isExamsScheduleLoading } = useQuery({
    queryKey: ['classrooms', classroomId, 'exams'],
    queryFn: async () => (classroomId ? await classroomsService.exams.get({ schoolId, classroomId }) : undefined),
    enabled: Boolean(classroomId),
  });

  const examsSchedule = examsScheduleData?.data;

  const handleDeleteClick = (exam: ClassroomExamScheduleResponse) => {
    setSelectedExam(exam);
    setIsDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
    setSelectedExam(null);
  };

  const handleEditClick = (exam: ClassroomExamScheduleResponse) => {
    setSelectedExam(exam);
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
    setSelectedExam(null);
  };

  return (
    <div className='bg-background min-h-screen'>
      <BreadcrumbHeader breadcrumbs={[{ title: 'Timetable', href: '/timetable' }]} />

      <div className='mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6'>
        {/* ── Top bar ── */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-foreground text-xl font-bold tracking-tight'>Weekly Timetable</h1>
            <p className='text-muted-foreground mt-0.5 text-sm'>Manage class sessions for each day of the week</p>
          </div>

          {classroomId && (
            <Button
              onClick={() => setIsAddOpen(true)}
              className='gap-2 rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
            >
              <Plus className='h-4 w-4' />
              Add Session
            </Button>
          )}
        </div>
      </div>

      {isAddOpen && classroomId && <AddScheduleExam classroomId={classroomId} setIsOpen={setIsAddOpen} />}

      {isEditOpen && classroomId && selectedExam && (
        <EditExamSchedule classroomId={classroomId} exam={selectedExam} setIsEditOpen={handleEditClose} />
      )}

      {isDeleteOpen && classroomId && selectedExam && (
        <DeleteScheduleExam classroomId={classroomId} examId={selectedExam.id} setIsDeleteOpen={handleDeleteClose} />
      )}
    </div>
  );
};

export default ExamScheduleOverview;
