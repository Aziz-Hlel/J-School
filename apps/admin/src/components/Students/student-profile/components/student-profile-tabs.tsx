import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatBytes } from '@/hooks/use-file-upload';
import dayjs from 'dayjs';
import { Activity, Baby, FileText, HeartPulse, Mail, MapPin, Phone, User, Users } from 'lucide-react';
import type { MedicalConditionType, StudentById } from './student.types';

const conditionMeta: Record<MedicalConditionType, { bg: string; text: string; badge: string }> = {
  ALLERGY: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-500',
    badge: 'bg-rose-100/40 text-rose-900 dark:text-rose-200',
  },
  VISION: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    badge: 'bg-blue-100/40 text-blue-900 dark:text-blue-200',
  },
  SPEECH: {
    bg: 'bg-violet-500/10',
    text: 'text-violet-500',
    badge: 'bg-violet-100/40 text-violet-900 dark:text-violet-200',
  },
  CHRONIC: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-500',
    badge: 'bg-amber-100/40 text-amber-900 dark:text-amber-200',
  },
  TREATMENT: {
    bg: 'bg-teal-500/10',
    text: 'text-teal-500',
    badge: 'bg-teal-100/40 text-teal-900 dark:text-teal-200',
  },
};

interface IProps {
  student: StudentById;
}

const StudentProfileTabs = ({ student }: IProps) => {
  const genderType = student.gender;
  if (!genderType) return null;

  return (
    <Tabs defaultValue='overview' className='w-full'>
      <TabsList className='mb-4 w-full justify-start border-b bg-transparent p-0'>
        <TabsTrigger value='overview'>
          <User className='mr-2 h-4 w-4' />
          Overview
        </TabsTrigger>

        <TabsTrigger value='parents'>
          <Users className='mr-2 h-4 w-4' />
          Parents
        </TabsTrigger>

        <TabsTrigger value='health'>
          <HeartPulse className='mr-2 h-4 w-4' />
          Health Information
        </TabsTrigger>

        <TabsTrigger value='documents'>
          <FileText className='mr-2 h-4 w-4' />
          Documents
        </TabsTrigger>
      </TabsList>

      {/* OVERVIEW */}
      <TabsContent value='overview'>
        <div className='grid gap-6 md:grid-cols-2'>
          <Card className='border-none shadow-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
                <Baby className='h-5 w-5' />
                Overview
              </CardTitle>
            </CardHeader>

            <CardContent className='grid gap-4'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground text-sm'>Gender</span>
                <span className='text-sm font-medium'>{genderType.label}</span>
              </div>

              <div className='flex justify-between'>
                <span className='text-muted-foreground text-sm'>Birth Date</span>
                <span className='text-sm font-medium'>{dayjs(student.birthDate).format('DD MMMM YYYY')}</span>
              </div>

              <div className='flex justify-between'>
                <span className='text-muted-foreground text-sm'>Nationality</span>
                <span className='text-sm font-medium'>{student.nationality || 'Not provided'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* PARENTS */}
      <TabsContent value='parents'>
        <div className='grid gap-6'>
          {student.parents.map((parent) => (
            <Card key={parent.id} className='border-none shadow-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
                  <Users className='h-5 w-5' />
                  {parent.user.name}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className='grid gap-8 md:grid-cols-2'>
                  <div className='space-y-4'>
                    <div className='flex items-center gap-3'>
                      <Mail className='h-4 w-4' />
                      <div>
                        <p className='text-muted-foreground text-xs'>Email</p>
                        <p className='text-sm font-semibold'>{parent.user.email}</p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <Phone className='h-4 w-4' />
                      <div>
                        <p className='text-muted-foreground text-xs'>Phone</p>
                        <p className='text-sm font-semibold'>{parent.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div className='flex items-center gap-3'>
                      <User className='h-4 w-4' />
                      <div>
                        <p className='text-muted-foreground text-xs'>Marital Status</p>
                        <p className='text-sm font-semibold'>{parent.maritalStatus || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <MapPin className='h-4 w-4' />
                      <div>
                        <p className='text-muted-foreground text-xs'>Address</p>
                        <p className='text-sm font-semibold'>{parent.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      {/* HEALTH */}
      <TabsContent value='health'>
        <div className='grid gap-6 md:grid-cols-2'>
          <Card className='border-none shadow-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Activity className='h-5 w-5' />
                Medical Conditions
              </CardTitle>
            </CardHeader>

            <CardContent>
              {student.healthInfo.medicalConditions.length > 0 ? (
                student.healthInfo.medicalConditions.map((condition) => (
                  <div key={condition.id} className='mb-3'>
                    <div className='text-sm font-medium'>{condition.type}</div>
                    <p className='text-muted-foreground text-sm'>{condition.details || 'Not provided'}</p>
                  </div>
                ))
              ) : (
                <p className='text-muted-foreground text-sm'>No conditions</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vaccination Status</CardTitle>
            </CardHeader>

            <CardContent>
              <p className='text-sm font-medium'>
                {student.healthInfo.vaccine === 'COMPLETE' ? 'Fully vaccinated' : 'Incomplete vaccination'}
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* DOCUMENTS */}
      <TabsContent value='documents'>
        <div className='space-y-4'>
          {student.studentDocuments?.media?.length ? (
            student.studentDocuments.media.map((media) => (
              <div key={media.id} className='border p-3'>
                <p className='text-sm font-medium'>{media.originalName}</p>
                <p className='text-muted-foreground text-xs'>{formatBytes(media.size)}</p>

                <a href={media.url} target='_blank' rel='noopener noreferrer'>
                  View
                </a>
              </div>
            ))
          ) : (
            <p className='text-muted-foreground text-sm'>No documents uploaded</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default StudentProfileTabs;
