import { attendanceService } from '@/api/service/attendanceService';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AttendanceSyncInput } from '@repo/contracts/schemas/Attendance/sync';
import type { ClassroomAttendancesResponse } from '@repo/contracts/schemas/classroom/management/getClassroomAttendancesResponse';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

const EditAttendances = ({
  attendances,
  timetableId,
  week,
  setIsEditOpen,
}: {
  attendances: ClassroomAttendancesResponse[];
  timetableId: string;
  week: number;
  setIsEditOpen: (value: boolean) => void;
}) => {
  const schoolId = useCurrentSchoolId();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['attendances', timetableId, week, 'update'],
    mutationFn: (payload: AttendanceSyncInput) => attendanceService.sync(schoolId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'], exact: false });
      setIsEditOpen(false);
    },
  });

  const form = useForm<AttendanceSyncInput>({
    resolver: zodResolver(updateStudentWithStatusRequestSchema),
    defaultValues: defaultValues,
  });

  const handleUpdateStudent = async (data: UpdateWithStatusStudentReq) => {
    try {
      await mutateAsync(data);
      toast.success('Student updated successfully');
    } catch {
      toast.error('Failed to update student');
    }
  };

  return <div>EditAttendances</div>;
};

export default EditAttendances;
