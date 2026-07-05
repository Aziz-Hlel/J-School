import { studentService } from '@/api/service/studentService';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { useQuery } from '@tanstack/react-query';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { VaccineStatus } from '@repo/contracts/types/enums/enums';
import { HeartPulse, Phone, ShieldAlert } from 'lucide-react';
import { useParams } from 'react-router';

const StudentHealth = () => {
  const { studentId } = useParams();
  const schoolId = useCurrentSchoolId();

  // Primary TanStack Query
  const { data } = useQuery({
    queryKey: ['students', studentId, 'full-details'],
    queryFn: () => studentService.findFullDetails(schoolId, studentId),
    enabled: !!studentId,
  });
  const student = data?.data ?? null;

  const getVaccineColor = (vaccine: VaccineStatus) => {
    switch (vaccine) {
      case 'FULLY_VACCINATED':
        return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
      case 'PARTIALLY_VACCINATED':
        return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      case 'NOT_VACCINATED':
        return 'bg-rose-500/10 text-rose-600 border border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 border border-slate-500/20';
    }
  };

  return (
    <div className='space-y-6 outline-hidden'>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Health profile card */}
        <Card className='rounded-2xl border-slate-100 shadow-xs lg:col-span-2 dark:border-zinc-800'>
          <CardHeader className='pb-4'>
            <CardTitle className='flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100'>
              <HeartPulse className='text-primary h-5 w-5' />
              Health & Vaccine Profile
            </CardTitle>
            <CardDescription>Allergies, vaccination history, and custom health records</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {student.profile ? (
              <>
                {/* Vaccine details */}
                <div className='flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 md:flex-row md:items-center dark:border-zinc-800 dark:bg-zinc-900/30'>
                  <div className='space-y-1'>
                    <h4 className='font-bold text-slate-700 dark:text-slate-300'>Vaccination Status</h4>
                    <p className='text-xs text-slate-400'>Required immunizations file validation status</p>
                  </div>
                  <Badge
                    variant='outline'
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${getVaccineColor(student.profile.vaccine)}`}
                  >
                    {student.profile.vaccine.replace('_', ' ').toLowerCase()}
                  </Badge>
                </div>

                {/* Allergies block */}
                <div className='space-y-2'>
                  <h4 className='flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300'>
                    <ShieldAlert className='h-4 w-4 text-rose-500' />
                    Allergies & Sensitivities
                  </h4>
                  <div className='rounded-xl border border-rose-100 bg-rose-50/30 p-4 dark:border-rose-950/30 dark:bg-rose-950/10'>
                    <p className='text-sm leading-relaxed font-medium text-slate-700 dark:text-slate-300'>
                      {student.profile.allergies || 'No allergies recorded.'}
                    </p>
                  </div>
                </div>

                {/* Health info notes */}
                <div className='space-y-2'>
                  <h4 className='font-bold text-slate-700 dark:text-slate-300'>Health Conditions & Medical Info</h4>
                  <div className='rounded-xl border border-slate-100 bg-slate-50/30 p-4 dark:border-zinc-800 dark:bg-zinc-900/30'>
                    <p className='text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
                      {student.profile.healthInfo || 'No major health conditions recorded.'}
                    </p>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className='space-y-2'>
                  <h4 className='font-bold text-slate-700 dark:text-slate-300'>Additional Medical Notes</h4>
                  <div className='rounded-xl border border-slate-100 bg-slate-50/30 p-4 dark:border-zinc-800 dark:bg-zinc-900/30'>
                    <p className='text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
                      {student.profile.notes || 'No extra notes.'}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className='flex flex-col items-center justify-center rounded-xl border border-dashed bg-slate-50/50 p-4 py-10 text-center dark:bg-zinc-900/30'>
                <ShieldAlert className='mb-2 h-12 w-12 text-slate-300' />
                <h4 className='font-bold text-slate-700 dark:text-slate-300'>No Health Record File</h4>
                <p className='mt-1 max-w-60 text-xs text-slate-400'>
                  Create a student profile to track health information, vaccine progress and emergencies.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency contacts card */}
        <Card className='rounded-2xl border-slate-100 shadow-xs dark:border-zinc-800'>
          <CardHeader className='pb-4'>
            <CardTitle className='flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100'>
              <Phone className='h-5 w-5 text-rose-500' />
              Emergency Contacts
            </CardTitle>
            <CardDescription>Immediate contacts in case of alert or distress</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {student.profile?.emergencyContacts && student.profile.emergencyContacts.length > 0 ? (
              student.profile.emergencyContacts.map((contact, idx) => (
                <div
                  key={idx}
                  className='group relative rounded-xl border border-slate-100 bg-slate-50/30 p-4 transition-all hover:border-slate-200 dark:border-zinc-800 dark:bg-zinc-900/20'
                >
                  <span className='absolute top-3 right-3 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-500 capitalize dark:bg-rose-950/20'>
                    {contact.relation.toLowerCase()}
                  </span>
                  <h4 className='text-base font-bold text-slate-800 dark:text-slate-200'>{contact.name}</h4>
                  <div className='mt-2 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400'>
                    <Phone className='h-4 w-4 text-slate-400' />
                    <span>{contact.phone}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className='flex flex-col items-center justify-center rounded-xl border border-dashed bg-slate-50/50 p-4 py-6 text-center dark:bg-zinc-900/30'>
                <Phone className='mb-2 h-8 w-8 text-slate-300' />
                <h4 className='font-bold text-slate-700 dark:text-slate-300'>No Emergency Contacts</h4>
                <p className='mt-1 max-w-45 text-xs text-slate-400'>Add immediate contact details for alerts.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentHealth;
