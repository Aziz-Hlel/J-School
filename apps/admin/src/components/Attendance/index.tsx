import { attendanceService } from '@/api/service/attendanceService';
import { classroomsService } from '@/api/service/classroomsService';
import schoolService from '@/api/service/schoolService';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import type { GetClassroomTimetableResponse } from '@repo/contracts/schemas/assignment/getClassroomTimetableResponse';
import { toWeekNbr } from '@repo/contracts/schemas/utils/getWeekNbr';
import { DayOfWeek } from '@repo/contracts/types/enums/enums';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';

const getRecentMonday = () => {
  const today = dayjs();
  const daysSinceMonday = (today.day() + 6) % 7;
  return today.subtract(daysSinceMonday, 'day');
};

const AttendanceOverview = () => {
  const schoolId = useCurrentSchoolId();
  const [currentWeek, setCurrentWeek] = useState<{ startDate: Date; endDate: Date }>({
    startDate: getRecentMonday().toDate(),
    endDate: getRecentMonday().add(6, 'day').toDate(),
  });

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [classroomId, setClassroomId] = useState<string | null>(null);
  const week = toWeekNbr(currentWeek.startDate);

  const { data: classroomsData } = useQuery({
    queryKey: ['classrooms', 'select'],
    queryFn: () => schoolService.selectClassrooms({ schoolId }),
  });

  const classrooms = classroomsData?.data ?? [];

  const [timetableId, setTimetableId] = useState<string | null>(null);
  const { data: timetableData } = useQuery({
    queryKey: ['classrooms', classroomId, 'timetable'],
    queryFn: async () =>
      classroomId ? await classroomsService.getClassroomTimetable({ schoolId, classroomId }) : undefined,
    enabled: !!classroomId,
  });

  const classroomTimetables: GetClassroomTimetableResponse = timetableData?.data ?? {
    [DayOfWeek.MONDAY]: [],
    [DayOfWeek.TUESDAY]: [],
    [DayOfWeek.WEDNESDAY]: [],
    [DayOfWeek.THURSDAY]: [],
    [DayOfWeek.FRIDAY]: [],
    [DayOfWeek.SATURDAY]: [],
    [DayOfWeek.SUNDAY]: [],
  };

  const { data, isPending, isError } = useQuery({
    queryKey: ['attendances', classroomId, timetableId, week],
    queryFn: async () =>
      classroomId && timetableId
        ? await attendanceService.get(schoolId, classroomId, { timetableId, week })
        : undefined,
    enabled: !!classroomId && !!timetableId,
  });

  const attendances = data?.data ?? [];

  return <div>AttendanceOverview</div>;
};

export default AttendanceOverview;
