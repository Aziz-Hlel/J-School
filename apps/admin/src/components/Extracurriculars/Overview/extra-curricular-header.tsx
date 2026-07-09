import { extraCurricularService } from '@/api/service/extracurricularsService';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router';

const ExtraCurricularHeader = () => {
  const schoolId = useCurrentSchoolId();
  const { extraCurricularId: id } = useParams();

  const extraCurricularId = id!;
  // Primary TanStack Query
  const { data, isError, isPending } = useQuery({
    queryKey: ['extra-curriculars', extraCurricularId],
    queryFn: () => extraCurricularService.get(schoolId, extraCurricularId),
  });
  const extraCurricular = data?.data ?? null;

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError || !extraCurricular) {
    return <div>Not Found</div>;
  }
  const formattedDate = extraCurricular.session.date ?? 'N/A';
  const sessionType = extraCurricular.session.type
    ? extraCurricular.session.type.charAt(0) + extraCurricular.session.type.slice(1).toLowerCase()
    : 'Session';

  return (
    <Card className='border-border bg-card overflow-hidden shadow-sm'>
      <CardContent className='relative p-0'>
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.10),transparent_32%),radial-gradient(circle_at_bottom_left,hsl(var(--muted-foreground)/0.10),transparent_28%)]' />
        <div className='relative flex flex-col gap-6 p-6 md:p-8 lg:flex-row lg:items-end lg:justify-between'>
          <div className='min-w-0 space-y-4'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge
                variant='secondary'
                className='rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.2em] uppercase'
              >
                {sessionType}
              </Badge>
              {extraCurricular.session.date && (
                <p className='text-muted-foreground text-sm'>Session date: {formattedDate}</p>
              )}
            </div>

            <div className='space-y-1'>
              <h1 className='text-foreground text-3xl font-semibold tracking-tight md:text-4xl'>
                {extraCurricular.title.en}
              </h1>
              {extraCurricular.title.fr && (
                <p className='text-muted-foreground text-base font-medium'>{extraCurricular.title.fr}</p>
              )}
              {extraCurricular.title.ar && (
                <p className='text-muted-foreground text-base font-medium'>{extraCurricular.title.ar}</p>
              )}
            </div>
          </div>

          <div className='w-full lg:w-auto'>
            <Tabs defaultValue='overview' className='w-full lg:w-60'>
              <TabsList className='bg-muted grid h-11 w-full grid-cols-2 rounded-full p-1'>
                <Link
                  to={`/extracurriculars/${extraCurricularId}/overview`}
                  className='data-[state=active]:bg-background data-[state=active]:text-foreground rounded-full'
                >
                  <TabsTrigger value='overview'>Overview</TabsTrigger>
                </Link>

                <Link
                  to={`/extracurriculars/${extraCurricularId}/feed`}
                  className='data-[state=active]:bg-background data-[state=active]:text-foreground rounded-full'
                >
                  <TabsTrigger value='feed'>Feed</TabsTrigger>
                </Link>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExtraCurricularHeader;
