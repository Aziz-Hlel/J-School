import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { classroomsService } from '@/api/service/classroomsService';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { useQuery } from '@tanstack/react-query';
import { BookOpenIcon, CalendarDaysIcon, FileTextIcon, ImagesIcon, PaperclipIcon, UsersIcon } from 'lucide-react';
import React, { useState } from 'react';
import type { TableRowType } from '../../core/types';

const getInitials = (firstName: string | null | undefined, lastName: string | null | undefined, fallback: string) =>
  `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase() || fallback;

const getFullName = (firstName: string | null, lastName: string | null) =>
  [firstName, lastName].filter(Boolean).join(' ') || 'Not provided';

const HomeworkView = ({ homework, children }: { homework: TableRowType; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const schoolId = useCurrentSchoolId();
  const teacherName = homework.teacher
    ? `${homework.teacher.firstName} ${homework.teacher.lastName}`
    : 'No teacher assigned';
  const teacherInitials = homework.teacher
    ? getInitials(homework.teacher.firstName, homework.teacher.lastName, 'T')
    : 'T';

  const { data: students = [], isLoading: areStudentsLoading } = useQuery({
    queryKey: ['school', schoolId, 'classrooms', homework.classroom.id, 'students'],
    queryFn: () => classroomsService.getStudents({ schoolId, classroomId: homework.classroom.id }),
    select: (response) => response.data,
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[calc(100vh-2rem)] gap-0 overflow-hidden p-0 sm:max-w-3xl'>
        <DialogHeader className='border-b px-6 py-5 pr-12'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='secondary'>{homework.classroom.grade}</Badge>
            <Badge variant='outline'>{homework.classroom.name}</Badge>
            <Badge variant='outline'>{homework.subject.name.fr}</Badge>
          </div>
          <DialogTitle className='text-xl'>{homework.title || 'Untitled homework'}</DialogTitle>
          <DialogDescription>Homework shared with the students in this classroom.</DialogDescription>
        </DialogHeader>

        <div className='max-h-[calc(100vh-14rem)] overflow-y-auto px-6 py-5'>
          <div className='flex flex-col gap-5'>
            <Card>
              <CardHeader className='gap-1'>
                <div className='flex items-center gap-2'>
                  <BookOpenIcon className='text-muted-foreground size-4' />
                  <CardTitle>Assignment</CardTitle>
                </div>
                <CardDescription>What the teacher asked the class to complete.</CardDescription>
              </CardHeader>
              <CardContent className='flex flex-col gap-4'>
                <div className='bg-muted/50 rounded-lg p-4'>
                  <p className='text-sm leading-6 whitespace-pre-wrap'>
                    {homework.content || 'No written instructions were provided.'}
                  </p>
                </div>
                <div className='flex flex-wrap items-center gap-2 text-sm'>
                  <Badge variant='outline'>
                    <CalendarDaysIcon data-icon='inline-start' />
                    Due {homework.due}
                  </Badge>
                  <Badge variant='outline'>{homework.type}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='gap-1'>
                <CardTitle>Teacher</CardTitle>
                <CardDescription>The teacher who shared this homework.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex items-center gap-3'>
                  <Avatar className='size-12'>
                    <AvatarImage src={homework.teacher?.avatar?.url} alt={teacherName} />
                    <AvatarFallback>{teacherInitials}</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col gap-0.5'>
                    <p className='font-medium'>{teacherName}</p>
                    <div className='flex flex-wrap items-center gap-2'>
                      <p className='text-muted-foreground text-sm'>Teacher</p>
                      {homework.teacher ? <Badge variant='outline'>{homework.teacher.gender}</Badge> : null}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='gap-1'>
                <CardTitle>Attachments</CardTitle>
                <CardDescription>
                  {homework.files.length
                    ? `${homework.files.length} file${homework.files.length === 1 ? '' : 's'} attached`
                    : 'No files attached'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {homework.files.length ? (
                  <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                    {homework.files.map((file, index) =>
                      file.type === 'IMAGE' ? (
                        <a
                          key={file.id}
                          href={file.url}
                          target='_blank'
                          rel='noreferrer'
                          className='group bg-muted/50 focus-visible:ring-ring overflow-hidden rounded-lg border focus-visible:ring-3 focus-visible:outline-none'
                        >
                          <img
                            src={file.url}
                            alt={`Homework attachment ${index + 1}`}
                            className='aspect-video w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]'
                          />
                          <span className='flex items-center gap-2 p-3 text-sm font-medium'>
                            <ImagesIcon className='text-muted-foreground size-4' />
                            Image {index + 1}
                          </span>
                        </a>
                      ) : (
                        <a
                          key={file.id}
                          href={file.url}
                          target='_blank'
                          rel='noreferrer'
                          className='hover:bg-muted/50 focus-visible:ring-ring flex min-h-32 flex-col justify-between rounded-lg border p-4 transition-colors focus-visible:ring-3 focus-visible:outline-none'
                        >
                          <FileTextIcon className='text-muted-foreground size-8' />
                          <span className='flex items-center gap-2 text-sm font-medium'>
                            <PaperclipIcon className='text-muted-foreground size-4' />
                            Open document {index + 1}
                          </span>
                        </a>
                      ),
                    )}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='gap-1'>
                <div className='flex items-center justify-between gap-3'>
                  <CardTitle>Students</CardTitle>
                  <Badge variant='secondary'>{students.length}</Badge>
                </div>
                <CardDescription>Students enrolled in {homework.classroom.name}.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type='single' collapsible className='rounded-lg border px-3'>
                  <AccordionItem value='students' className='border-0'>
                    <AccordionTrigger>
                      <span className='flex items-center gap-2'>
                        <UsersIcon className='text-muted-foreground size-4' />
                        View class roster
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className='pt-2'>
                      <div className='flex flex-col gap-3'>
                        {students.map((student, index) => {
                          const englishName = getFullName(student.firstName.en, student.lastName.en);
                          const arabicName = getFullName(student.firstName.ar, student.lastName.ar);

                          return (
                            <React.Fragment key={student.id}>
                              {index > 0 ? <Separator /> : null}
                              <div className='flex items-center gap-3 py-1'>
                                <Avatar className='size-10'>
                                  <AvatarImage src={student.avatar?.url} alt={englishName} />
                                  <AvatarFallback>
                                    {getInitials(
                                      student.firstName.en ?? student.firstName.ar,
                                      student.lastName.en ?? student.lastName.ar,
                                      'S',
                                    )}
                                  </AvatarFallback>
                                </Avatar>
                                <div className='min-w-0 flex-1'>
                                  <p className='truncate text-sm font-medium'>{englishName}</p>
                                  <p dir='rtl' className='text-muted-foreground truncate text-sm'>
                                    {arabicName}
                                  </p>
                                </div>
                              </div>
                            </React.Fragment>
                          );
                        })}
                        {areStudentsLoading ? (
                          <p className='text-muted-foreground py-3 text-center text-sm'>Loading class roster…</p>
                        ) : null}
                        {!areStudentsLoading && students.length === 0 ? (
                          <p className='text-muted-foreground py-3 text-center text-sm'>
                            No students are enrolled in this classroom.
                          </p>
                        ) : null}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button type='button' variant='secondary' onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HomeworkView;
