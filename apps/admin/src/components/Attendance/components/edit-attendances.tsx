import { attendanceService } from '@/api/service/attendanceService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import queryClient from '@/config/react-qeury';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { attendanceSyncDto, type AttendanceSyncInput } from '@repo/contracts/schemas/Attendance/sync';
import type { ClassroomAttendancesResponse } from '@repo/contracts/schemas/classroom/management/getClassroomAttendancesResponse';
import { AttendanceStatus } from '@repo/contracts/types/enums/enums';
import { useMutation } from '@tanstack/react-query';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

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
      queryClient.invalidateQueries({ queryKey: ['attendances'], exact: false });
      setIsEditOpen(false);
    },
  });

  const form = useForm<AttendanceSyncInput>({
    resolver: zodResolver(attendanceSyncDto),
    defaultValues: {
      timetableId: timetableId,
      week: week,
      students: attendances.map((a) => {
        return {
          studentId: a.id,
          status: a.attendance?.status ?? AttendanceStatus.PRESENT,
          note: a.attendance?.note ?? null,
        };
      }),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'students',
  });

  const handleUpdate = async (data: AttendanceSyncInput) => {
    try {
      await mutateAsync(data);
      toast.success('Attendances updated successfully');
    } catch {
      toast.error('Failed to update attendances');
    }
  };
  const { t } = useTranslation(['attendance']);

  return (
    <Dialog open={true} onOpenChange={setIsEditOpen}>
      <DialogContent className='flex max-h-[85vh] flex-col overflow-hidden rounded-2xl sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-slate-800 dark:text-slate-100'>
            {t('attendance:edit_dialog.title')}
          </DialogTitle>
          <DialogDescription>{t('attendance:edit_dialog.description', { week })}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleUpdate)} className='flex flex-1 flex-col gap-4 overflow-hidden py-2'>
          <div className='max-h-[50vh] flex-1 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent space-y-4 overflow-y-auto pr-2'>
            <FieldGroup>
              {fields.map((field, index) => {
                const student = attendances[index];
                if (!student) return null;

                const currentStatus = form.watch(`students.${index}.status`);
                const showNote = currentStatus && currentStatus !== AttendanceStatus.PRESENT;

                return (
                  <div
                    key={field.id}
                    className='flex flex-col gap-2 rounded-xl border bg-slate-50/50 p-3 dark:bg-zinc-900/30'
                  >
                    <div className='flex items-center justify-between gap-4'>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-9 w-9'>
                          {student.avatar?.key && (
                            <AvatarImage
                              src={student.avatar.key}
                              alt={`${student.firstName.en} ${student.lastName.en}`}
                            />
                          )}
                          <AvatarFallback>
                            {student.firstName.en?.[0] || ''}
                            {student.lastName.en?.[0] || ''}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className='text-sm font-medium text-slate-800 dark:text-slate-100'>
                            {student.firstName.en} {student.lastName.en}
                          </div>
                          {student.firstName.ar && (
                            <div className='text-xs font-normal text-slate-500 dark:text-slate-400' dir='rtl'>
                              {student.firstName.ar} {student.lastName.ar}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Select */}
                      <div className='w-40'>
                        <Controller
                          name={`students.${index}.status`}
                          control={form.control}
                          render={({ field: selectField }) => (
                            <Select onValueChange={selectField.onChange} value={selectField.value ?? ''}>
                              <SelectTrigger className='h-8 text-xs'>
                                <SelectValue placeholder='Select status' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={AttendanceStatus.PRESENT}>Present</SelectItem>
                                <SelectItem value={AttendanceStatus.ABSENT}>Absent</SelectItem>
                                <SelectItem value={AttendanceStatus.LATE}>Late</SelectItem>
                                <SelectItem value={AttendanceStatus.EXCUSED}>Excused</SelectItem>
                                <SelectItem value={AttendanceStatus.EXCLUDED}>Excluded</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>

                    {/* Note input - only show if status is not PRESENT */}
                    {showNote && (
                      <div className='pl-12'>
                        <Controller
                          name={`students.${index}.note`}
                          control={form.control}
                          render={({ field: noteField, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className='flex-col gap-1'>
                              <Input
                                {...noteField}
                                value={noteField.value ?? ''}
                                id={`note-${index}`}
                                placeholder='Add an optional attendance note...'
                                className='h-8 text-xs'
                              />
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </FieldGroup>
          </div>

          <DialogFooter className='gap-2 border-t pt-4 sm:gap-0'>
            <Button type='button' variant='outline' onClick={() => setIsEditOpen(false)}>
              {t('attendance:dialog.cancel')}
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending ? t('attendance:dialog.saving') : t('attendance:dialog.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAttendances;
