import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatBytes } from '@/hooks/use-file-upload';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import {
  Activity,
  AlertTriangle,
  Baby,
  FileText,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Stethoscope,
  Syringe,
  User,
  Users,
} from 'lucide-react';
import { statusTypes } from '../data/data';
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

export default function StudentProfileTabs({ student }: IProps) {
  const genderType = student.gender;
  const t = (x: string) => x;
  if (!genderType) return null;
  return (
    <Tabs defaultValue='overview' className='w-full'>
      <TabsList className='mb-4 w-full justify-start border-b bg-transparent p-0'>
        <TabsTrigger
          value='overview'
          className='bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none!'
        >
          <User className='mr-2 h-4 w-4' />
          {t('students:profile.tabs.overview.title')}
        </TabsTrigger>
        <TabsTrigger
          value='parents'
          className='bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none!'
        >
          <Users className='mr-2 h-4 w-4' />
          {t('students:profile.tabs.parents.title')}
        </TabsTrigger>
        <TabsTrigger
          value='health'
          className='bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none!'
        >
          <HeartPulse className='mr-2 h-4 w-4' />
          {t('students:profile.tabs.health_information.title')}
        </TabsTrigger>
        <TabsTrigger
          value='documents'
          className='bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none!'
        >
          <FileText className='mr-2 h-4 w-4' />
          {t('students:profile.tabs.documents.title')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value='overview'>
        <div className='grid gap-6 md:grid-cols-2'>
          <Card className='border-none shadow-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
                <Baby className='text-primary h-5 w-5' />
                {t('students:profile.tabs.overview.heading')}
              </CardTitle>
            </CardHeader>
            <CardContent className='grid gap-4'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground text-sm'>{t('common:genders.title')}</span>
                <Badge variant='outline' className={cn('rounded-none capitalize', genderType.className)}>
                  <genderType.icon />

                  {t(`common:genders.${genderType.label.toLowerCase()}`)}
                </Badge>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground text-sm'>{t('students:profile.tabs.overview.birth_date')}</span>
                <span className='text-sm font-medium'>{dayjs(student.birthDate).format('dd MMMM yyyy')}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground text-sm'>{t('students:profile.tabs.overview.nationality')}</span>
                <span className='text-sm font-medium'>{student.nationality || t('common:not_provided')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value='parents'>
        <div className='grid gap-6'>
          {student.parents.map((parent) => (
            <Card key={parent.id} className='border-none shadow-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
                  <Users className='text-primary h-5 w-5' />
                  {parent.user.name}{' '}
                  <Badge
                    variant={'outline'}
                    className={cn('rounded-none capitalize', statusTypes.get(parent.user.status)!.className)}
                  >
                    {t(`common:status.${parent.user.status.toLowerCase()}`)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-8 md:grid-cols-2'>
                  <div className='space-y-4'>
                    <div className='flex items-center gap-3'>
                      <div className='bg-primary/10 rounded-full p-2'>
                        <Mail className='text-primary h-4 w-4' />
                      </div>
                      <div>
                        <p className='text-muted-foreground text-xs'>{t('students:profile.tabs.parents.email')}</p>
                        <p className='text-sm font-semibold'>{parent.user.email}</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='bg-primary/10 rounded-full p-2'>
                        <Phone className='text-primary h-4 w-4' />
                      </div>
                      <div>
                        <p className='text-muted-foreground text-xs'>{t('students:profile.tabs.parents.phone')}</p>
                        <p className='text-sm font-semibold'>{parent.phone || t('common:not_provided')}</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='bg-primary/10 rounded-full p-2'>
                        <ShieldCheck className='text-primary h-4 w-4' />
                      </div>
                      <div>
                        <p className='text-muted-foreground text-xs'>{t('students:profile.tabs.parents.profession')}</p>
                        <p className='text-sm font-semibold'>{parent.profession || t('common:not_provided')}</p>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div className='flex items-center gap-3'>
                      <div className='bg-primary/10 rounded-full p-2'>
                        <User className='text-primary h-4 w-4' />
                      </div>
                      <div>
                        <p className='text-muted-foreground text-xs'>
                          {t('students:profile.tabs.parents.marital_status')}
                        </p>
                        <p className='text-sm font-semibold'>{parent.maritalStatus || t('common:not_provided')}</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='bg-primary/10 rounded-full p-2'>
                        <MapPin className='text-primary h-4 w-4' />
                      </div>
                      <div>
                        <p className='text-muted-foreground text-xs'>{t('students:profile.home_address')}</p>
                        <p className='text-sm font-semibold'>{parent.address || t('common:not_provided')}</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='bg-primary/10 rounded-full p-2'>
                        <FileText className='text-primary h-4 w-4' />
                      </div>
                      <div>
                        <p className='text-muted-foreground text-xs'>CIN</p>
                        <p className='text-sm font-semibold'>{parent.cin || t('common:not_provided')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value='health'>
        <div className='grid gap-6 md:grid-cols-2'>
          {/* Medical Conditions */}
          <Card className='border-none shadow-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
                <Activity className='text-primary h-5 w-5' />
                {t('students:profile.tabs.health_information.medical_conditions')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {student.healthInfo.medicalConditions.length > 0 ? (
                <div className='space-y-3'>
                  {student.healthInfo.medicalConditions.map((condition) => (
                    <div
                      key={condition.id}
                      className='border-border/50 bg-muted/30 flex items-start gap-3 rounded-lg border p-3'
                    >
                      <div className={cn('mt-0.5 rounded-full p-1.5', conditionMeta[condition.type]?.bg || 'bg-muted')}>
                        <AlertTriangle
                          className={cn('h-3.5 w-3.5', conditionMeta[condition.type]?.text || 'text-muted-foreground')}
                        />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <Badge
                          variant='outline'
                          className={cn(
                            'mb-1 rounded-none border-transparent text-xs',
                            conditionMeta[condition.type]?.badge || '',
                          )}
                        >
                          {t(`students:medical_conditions.${condition.type.toLowerCase()}`)}
                        </Badge>
                        {condition.details && (
                          <p className='text-muted-foreground text-sm'>
                            {condition.details || t('common:not_provided')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center py-6 text-center'>
                  <div className='mb-2 rounded-full bg-emerald-500/10 p-3'>
                    <ShieldCheck className='h-5 w-5 text-emerald-500' />
                  </div>
                  <p className='text-sm font-medium'>{t('students:profile.tabs.health_information.no_conditions')}</p>
                  <p className='text-muted-foreground text-xs'>
                    {t('students:profile.tabs.health_information.no_conditions_desc')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vaccination Status */}
          <Card className='border-none shadow-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
                <Syringe className='text-primary h-5 w-5' />
                {t('students:profile.tabs.health_information.vaccination_status')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  'flex items-center gap-4 rounded-lg border p-4',
                  student.healthInfo.vaccine === 'COMPLETE'
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-amber-500/30 bg-amber-500/5',
                )}
              >
                <div
                  className={cn(
                    'rounded-full p-2.5',
                    student.healthInfo.vaccine === 'COMPLETE' ? 'bg-emerald-500/10' : 'bg-amber-500/10',
                  )}
                >
                  <Syringe
                    className={cn(
                      'h-5 w-5',
                      student.healthInfo.vaccine === 'COMPLETE' ? 'text-emerald-500' : 'text-amber-500',
                    )}
                  />
                </div>
                <div>
                  <p className='text-sm font-semibold'>
                    {student.healthInfo.vaccine === 'COMPLETE'
                      ? t('students:profile.tabs.health_information.vaccination.fully_vaccinated')
                      : t('students:profile.tabs.health_information.vaccination.incomplete')}
                  </p>

                  {student.healthInfo.vaccine === 'UNCOMPLETE' && (
                    <p className='text-muted-foreground text-xs'>
                      {t('students:profile.tabs.health_information.some_vaccinations_incomplete')}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className='border-none shadow-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
                <Phone className='text-primary h-5 w-5' />
                {t('students:profile.tabs.health_information.emergency_contacts')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {student.healthInfo.emergencyContacts.length > 0 ? (
                <div className='space-y-3'>
                  {student.healthInfo.emergencyContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className='border-border/50 bg-muted/30 flex items-center gap-3 rounded-lg border p-3'
                    >
                      <div className='bg-primary/10 rounded-full p-2'>
                        <User className='text-primary h-4 w-4' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='text-sm font-semibold'>{contact.name}</p>
                      </div>
                      <div className='text-muted-foreground flex items-center gap-1.5 text-sm'>
                        <Phone className='h-3.5 w-3.5' />
                        {contact.phone}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-muted-foreground py-4 text-center text-sm'>
                  {t('students:profile.tabs.health_information.no_emergency_contact')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Doctor Information */}
          <Card className='border-none shadow-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
                <Stethoscope className='text-primary h-5 w-5' />
                {t('students:profile.tabs.health_information.doctor_information.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {student.healthInfo.doctorName || student.healthInfo.doctorPhone ? (
                <div className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <div className='bg-primary/10 rounded-full p-2'>
                      <User className='text-primary h-4 w-4' />
                    </div>
                    <div>
                      <p className='text-muted-foreground text-xs'>
                        {t('students:profile.tabs.health_information.doctor_information.name')}
                      </p>
                      <p className='text-sm font-semibold'>
                        {student.healthInfo.doctorName || t('common:not_provided')}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='bg-primary/10 rounded-full p-2'>
                      <Phone className='text-primary h-4 w-4' />
                    </div>
                    <div>
                      <p className='text-muted-foreground text-xs'>
                        {t('students:profile.tabs.health_information.doctor_information.phone')}
                      </p>
                      <p className='text-sm font-semibold'>
                        {student.healthInfo.doctorPhone || t('common:not_provided')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className='text-muted-foreground py-4 text-center text-sm'>
                  {t('students:profile.tabs.health_information.doctor_information.no_doctor')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Family Members */}
          {student.familyMembers && student.familyMembers.length > 0 && (
            <Card className='border-none shadow-sm md:col-span-2'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
                  <Users className='text-primary h-5 w-5' />
                  {t('students:profile.tabs.health_information.family_members.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                  {student.familyMembers.map((member, idx) => (
                    <div
                      key={idx}
                      className='border-border/50 bg-muted/30 flex items-start gap-3 rounded-lg border p-3'
                    >
                      <div className='bg-primary/10 rounded-full p-2'>
                        <User className='text-primary h-4 w-4' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='text-sm font-semibold'>{member.name}</p>
                        <div className='text-muted-foreground mt-1 flex items-center gap-1.5 text-xs'>
                          <Phone className='h-3 w-3' />
                          {member.phone}
                        </div>
                        {member.description && (
                          <p className='text-muted-foreground mt-1 text-xs'>{member.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value='documents'>
        <div className='flex flex-col items-center justify-center py-6 text-center'>
          <div className='mb-6 grid w-full grid-cols-1 gap-2'>
            {student.studentDocuments &&
              student.studentDocuments.media.map((media) => (
                <div className='flex w-full flex-col items-start justify-center gap-2'>
                  <Badge variant='secondary' className='rounded-none text-xs'>
                    <p className='font-semibold'>{media.purpose}</p>
                  </Badge>
                  <div key={media.id} className='border-border bg-card w-full rounded-none border p-2.5'>
                    <div className='flex items-start gap-2.5'>
                      {/* File Icon */}
                      <div className='shrink-0'>
                        <div className='border-border text-muted-foreground flex h-12 w-12 items-center justify-center rounded-lg border'>
                          <FileText className='text-destructive size-4' />
                        </div>
                      </div>

                      {/* File Info */}
                      <div className='min-w-0 flex-1'>
                        <div className='mt-0.75 flex items-center justify-between'>
                          <div className='inline-flex flex-col items-start justify-center gap-1 truncate font-medium'>
                            <span className='text-sm'>{media.originalName}</span>
                            <span className='text-muted-foreground text-xs'>{formatBytes(media.size)}</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <Button variant='link' className='h-auto p-0 pe-5 text-xs' asChild>
                              <a href={media.url} target='_blank' rel='noopener noreferrer'>
                                {t('common:actions.view')}
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {(!student.studentDocuments || student.studentDocuments.media.length === 0) && (
            <p className='text-muted-foreground max-w-sm px-4 text-sm'>
              {t('students:profile.tabs.documents.no_documents_uploaded')}
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
