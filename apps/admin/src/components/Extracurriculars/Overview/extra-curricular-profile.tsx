import { extraCurricularService } from '@/api/service/extracurricularsService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

const getLocalizedName = (name: { en: string | null; ar: string | null }) => name.en ?? name.ar ?? 'Unnamed';

const getInitials = (firstName: string | null, lastName: string | null) => {
  const first = firstName?.trim()?.[0] ?? '';
  const last = lastName?.trim()?.[0] ?? '';
  return `${first}${last}`.toUpperCase() || '—';
};

const formatLabel = (value: string) => value.charAt(0) + value.slice(1).toLowerCase();

const ExtraCurricularProfile = () => {
  const schoolId = useCurrentSchoolId();
  const { extraCurricularId: id } = useParams();

  const extraCurricularId = id!;

  const { data, isError, isPending } = useQuery({
    queryKey: ['extra-curriculars', extraCurricularId],
    queryFn: () => extraCurricularService.get(schoolId, extraCurricularId),
  });
  const extraCurricular = data?.data ?? null;

  const {
    data: studentsData,
    isError: studentsIsError,
    isPending: studentsIsPending,
  } = useQuery({
    queryKey: ['extra-curriculars', extraCurricularId, 'students'],
    queryFn: () => extraCurricularService.getStudents(schoolId, extraCurricularId),
  });
  const students = studentsData?.data ?? [];

  if (isPending) return <div className='text-muted-foreground py-8 text-sm'>Loading profile...</div>;

  if (isError || !extraCurricular || studentsIsError) {
    return <div className='text-destructive py-8 text-sm'>Unable to load extracurricular profile.</div>;
  }

  const teacher = extraCurricular.teacher;
  const teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}`.trim() : 'No teacher assigned';
  const teacherInitials = teacher ? getInitials(teacher.firstName, teacher.lastName) : '—';

  return (
    <div className='grid gap-6 py-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]'>
      <Card className='border-border bg-card shadow-sm'>
        <CardHeader className='flex flex-row items-start justify-between gap-4 space-y-0 pb-4'>
          <div>
            <CardTitle className='text-lg font-semibold'>Students</CardTitle>
            <p className='text-muted-foreground mt-1 text-sm'>Students enrolled in this extracurricular.</p>
          </div>
          <Badge variant='secondary' className='rounded-full px-3 py-1 text-xs font-semibold'>
            {students.length} total
          </Badge>
        </CardHeader>

        <CardContent className='space-y-3'>
          {studentsIsPending ? (
            <div className='border-border bg-muted/40 text-muted-foreground rounded-2xl border border-dashed px-4 py-6 text-sm'>
              Loading students...
            </div>
          ) : students.length > 0 ? (
            <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
              {students.map((student) => {
                const firstName = getLocalizedName(student.firstName);
                const lastName = getLocalizedName(student.lastName);
                const studentName = `${firstName} ${lastName}`.trim();
                const initials = getInitials(firstName, lastName);
                const classroomName = student.classroom?.name ?? 'No classroom';
                const grade = student.classroom?.grade ?? 'No grade';

                return (
                  <div
                    key={student.id}
                    className='border-border bg-background hover:bg-muted/40 flex items-center gap-3 rounded-2xl border p-3 shadow-sm transition-colors'
                  >
                    <Avatar className='h-11 w-11'>
                      <AvatarImage src={student.avatar?.url ?? undefined} alt={studentName} />
                      <AvatarFallback className='text-xs font-semibold'>{initials}</AvatarFallback>
                    </Avatar>

                    <div className='min-w-0 flex-1'>
                      <p className='text-foreground truncate text-sm font-semibold'>{studentName}</p>
                      <div className='mt-1 flex items-center gap-2'>
                        <Badge
                          variant='outline'
                          className='rounded-full px-2 py-0.5 text-[10px] tracking-wide uppercase'
                        >
                          {grade} - {classroomName}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='border-border bg-muted/40 text-muted-foreground rounded-2xl border border-dashed px-4 py-10 text-center text-sm'>
              No students are assigned yet.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className='border-border bg-card shadow-sm'>
        <CardHeader className='space-y-4'>
          <div className='flex items-start justify-between gap-3'>
            <div>
              <CardTitle className='text-lg font-semibold'>Assigned Teacher</CardTitle>
              <p className='text-muted-foreground mt-1 text-sm'>
                The current assigned user is shown here. Editing can be wired in later.
              </p>
            </div>
            {/* <Button type='button' variant='outline' size='sm' className='rounded-full'>
              Edit assigned user
            </Button> */}
          </div>
          <Separator />
        </CardHeader>

        <CardContent>
          {teacher ? (
            <div className='border-border from-muted/50 to-background flex items-start gap-4 rounded-3xl border bg-linear-to-br p-4'>
              <Avatar className='ring-background h-16 w-16 shadow-sm ring-2'>
                <AvatarImage src={teacher.avatar?.url ?? undefined} alt={teacherName} />
                <AvatarFallback className='text-sm font-semibold'>{teacherInitials}</AvatarFallback>
              </Avatar>

              <div className='min-w-0 flex-1 space-y-2'>
                <div>
                  <p className='text-foreground truncate text-base font-semibold'>{teacherName}</p>
                  <p className='text-muted-foreground text-sm'>Assigned teacher</p>
                </div>

                <div className='flex flex-wrap items-center gap-2'>
                  <Badge variant='secondary' className='rounded-full px-3 py-1 text-xs font-medium'>
                    {formatLabel(teacher.gender)}
                  </Badge>
                  <Badge variant='outline' className='rounded-full px-3 py-1 text-xs font-medium'>
                    Teacher profile
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className='border-border bg-muted/40 text-muted-foreground rounded-3xl border border-dashed px-4 py-10 text-sm'>
              No teacher assigned yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtraCurricularProfile;
