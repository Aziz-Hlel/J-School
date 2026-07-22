import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TeacherCommentsResponse } from '@repo/contracts/schemas/TeacherComments/response';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TeacherCommentView = ({
  teacherComment,
  children,
}: {
  teacherComment: TeacherCommentsResponse;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(['comments']);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='rounded-2xl sm:max-w-106.25'>
        <DialogHeader>
          <DialogTitle>{t('comments:viewTitle')}</DialogTitle>
          <DialogDescription>{t('comments:viewDescription')}</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <Card>
            <CardContent className='flex items-center gap-4 p-4'>
              <Avatar className='size-10'>
                <AvatarImage src={teacherComment.teacher.avatar?.url} />
                <AvatarFallback>{teacherComment.teacher.firstName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className='text-sm leading-none font-medium'>
                  Teacher: {teacherComment.teacher.firstName} {teacherComment.teacher.lastName}
                </p>
                <p className='text-muted-foreground text-sm'>Gender: {teacherComment.teacher.gender}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='flex items-center gap-4 p-4'>
              <Avatar className='size-10'>
                <AvatarImage src={teacherComment.student.avatar?.url} />
                <AvatarFallback>{teacherComment.student.firstName.en?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className='text-sm leading-none font-medium'>
                  Student (English): {teacherComment.student.firstName.en} {teacherComment.student.lastName.en}
                </p>
                <p className='text-sm leading-none font-medium'>
                  Student (Arabic): {teacherComment.student.firstName.ar} {teacherComment.student.lastName.ar}
                </p>
                <p className='text-muted-foreground text-sm'>Gender: {teacherComment.student.gender}</p>
              </div>
            </CardContent>
          </Card>

          <div className='grid gap-2'>
            <Label htmlFor='title'>Title</Label>
            <Input id='title' defaultValue={teacherComment.title} readOnly />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='content'>Content</Label>
            <Input id='content' defaultValue={teacherComment.content} readOnly />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='createdAt'>Created At</Label>
            <Input id='createdAt' defaultValue={new Date(teacherComment.createdAt).toLocaleString()} readOnly />
          </div>

          {teacherComment.canParentReply && (
            <div className='grid gap-2'>
              <Label htmlFor='parentReply'>Parent Reply</Label>
              <Input id='parentReply' defaultValue={teacherComment.parentReply || 'N/A'} readOnly />
            </div>
          )}
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

export default TeacherCommentView;
