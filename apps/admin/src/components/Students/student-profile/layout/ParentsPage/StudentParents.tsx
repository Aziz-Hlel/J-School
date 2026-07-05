import { studentService } from '@/api/service/studentService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import type { ParentResponse } from '@repo/contracts/schemas/parent/parentResponse';
import { useQuery } from '@tanstack/react-query';
import { Award, Mail, MapPin, Phone, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router';
import AssignParent from '../../components/assign-parent';
import UnassignParentDialog from '../../components/unassign-parent-dialog';

const StudentParents = () => {
  const { studentId } = useParams();
  const schoolId = useCurrentSchoolId();

  // Primary TanStack Query
  const { data } = useQuery({
    queryKey: ['students', studentId, 'full-details'],
    queryFn: () => studentService.findFullDetails(schoolId, studentId),
    enabled: !!studentId,
  });
  const student = data?.data ?? null;

  const [isAssignParentOpen, setIsAssignParentOpen] = useState(false);
  const [isUnassignParentOpen, setIsUnassignParentOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<ParentResponse | null>(null);

  return (
    <div className='space-y-6 outline-hidden'>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h2 className='text-xl font-bold text-slate-800 dark:text-slate-100'>Parents & Guardians</h2>
          <p className='text-sm text-slate-500'>
            Assigned representatives authorized for pick-ups and school communications
          </p>
        </div>
        <Button
          size='sm'
          className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-xs'
          onClick={() => setIsAssignParentOpen(true)}
        >
          <Plus className='mr-1.5 h-4 w-4' />
          Assign Parent
        </Button>
      </div>

      {student.parents.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white p-12 text-center shadow-xs dark:bg-zinc-900/10'>
          <Users className='mb-3 h-12 w-12 text-slate-300' />
          <h3 className='text-lg font-bold text-slate-700 dark:text-slate-300'>No Parents Assigned</h3>
          <p className='mt-1 mb-6 max-w-sm text-sm text-slate-400'>
            This student profile currently does not have any linked parent or guardian details.
          </p>
          <Button size='sm' className='bg-primary rounded-xl' onClick={() => setIsAssignParentOpen(true)}>
            Link Parent Record Now
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {student.parents.map((parent) => (
            <Card
              key={parent.id}
              className='relative flex flex-col justify-between overflow-hidden rounded-2xl border-slate-100 transition-all duration-200 hover:shadow-md dark:border-zinc-800'
            >
              <CardContent className='flex flex-1 flex-col justify-between gap-6 p-6'>
                <div className='space-y-4'>
                  <div className='flex items-start gap-4'>
                    <Avatar className='border-background h-16 w-16 shrink-0 rounded-xl border-2 shadow-xs'>
                      {parent.avatar?.url ? (
                        <AvatarImage src={parent.avatar.url} alt={`${parent.firstName} ${parent.lastName}`} />
                      ) : null}
                      <AvatarFallback className='bg-primary/10 text-primary rounded-xl text-lg font-bold'>
                        {parent.firstName.slice(0, 1).toUpperCase()}
                        {parent.lastName.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='min-w-0'>
                      <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                        <h3 className='truncate text-lg leading-tight font-bold text-slate-800 dark:text-slate-200'>
                          {parent.firstName} {parent.lastName}
                        </h3>
                        <Badge
                          variant='secondary'
                          className='rounded-full px-2 py-0.5 text-[10px] font-medium capitalize'
                        >
                          {parent.gender.toLowerCase()}
                        </Badge>
                      </div>
                      <p className='mt-0.5 font-mono text-[10px] text-slate-400'>ID: {parent.id}</p>
                    </div>
                  </div>

                  <Separator className='bg-slate-100 dark:bg-zinc-800' />

                  <div className='space-y-2 text-sm text-slate-600 dark:text-slate-400'>
                    <div className='flex items-center gap-3'>
                      <Mail className='h-4 w-4 shrink-0 text-slate-400' />
                      <span className='truncate'>{parent.email || 'No email provided'}</span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Phone className='h-4 w-4 shrink-0 text-slate-400' />
                      <span>{parent.phone || 'No phone number'}</span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <MapPin className='h-4 w-4 shrink-0 text-slate-400' />
                      <span className='truncate'>{parent.address || 'No address provided'}</span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Award className='h-4 w-4 shrink-0 text-slate-400' />
                      <span>
                        CIN / Identity Card:{' '}
                        <span className='font-semibold text-slate-700 dark:text-slate-300'>
                          {parent.cin || 'Not provided'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => {
                    setIsUnassignParentOpen(true);
                    setSelectedParent(parent);
                  }}
                  className='mt-4 w-full rounded-xl border-rose-200 bg-rose-50 font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400'
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Unassign Parent Link
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isAssignParentOpen && <AssignParent studentId={studentId} setIsAssignParentOpen={setIsAssignParentOpen} />}

      {isUnassignParentOpen && (
        <UnassignParentDialog
          studentId={studentId}
          parentId={selectedParent?.id || ''}
          handleCancel={() => setIsUnassignParentOpen(false)}
        />
      )}
    </div>
  );
};

export default StudentParents;
