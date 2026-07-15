import { classroomsService } from '@/api/service/classroomsService';
import { teacherService } from '@/api/service/teachersService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { useGetCurrentProfile } from '@/store/useAuthStore';
import type { StudentResponse } from '@repo/contracts/schemas/student/studentResponse';
import { useQuery } from '@tanstack/react-query';
import { Check, Loader2, Search, Users, X } from 'lucide-react';
import { useState } from 'react';

interface SelectStudentsProps {
  children: React.ReactNode;
  onSelect?: (students: string[]) => void;
  initialSelectedStudents?: StudentResponse[];
}

const SelectStudents = ({ children, onSelect, initialSelectedStudents = [] }: SelectStudentsProps) => {
  const schoolId = useCurrentSchoolId();
  const currentProfile = useGetCurrentProfile();
  const [open, setOpen] = useState(false);

  // Queries
  const { data: classroomsData, isLoading: isLoadingClassrooms } = useQuery({
    queryKey: ['teachers', currentProfile?.id, 'classrooms'],
    queryFn: () => teacherService.classrooms(schoolId, currentProfile!.id),
  });

  const classrooms = classroomsData?.data || [];

  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(null);

  const { data: studentsData, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['teachers', currentProfile?.id, 'classrooms', selectedClassroomId, 'students'],
    queryFn: () => classroomsService.getStudents({ schoolId, classroomId: selectedClassroomId || '' }),
    enabled: !!selectedClassroomId,
  });

  const students = studentsData?.data || [];

  // State
  const [selectedStudents, setSelectedStudents] = useState<StudentResponse[]>(initialSelectedStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchQuery, setSelectedSearchQuery] = useState('');

  const getStudentName = (student: StudentResponse) => {
    const first = student.firstName.en || student.firstName.ar || '';
    const last = student.lastName.en || student.lastName.ar || '';
    return `${first} ${last}`.trim();
  };

  const getInitials = (student: StudentResponse) => {
    const first = (student.firstName.en || student.firstName.ar || '').charAt(0);
    const last = (student.lastName.en || student.lastName.ar || '').charAt(0);
    return `${first}${last}`.toUpperCase();
  };

  const handleToggleStudent = (student: StudentResponse) => {
    setSelectedStudents((prev) => {
      const isAlreadySelected = prev.some((s) => s.id === student.id);
      if (isAlreadySelected) {
        return prev.filter((s) => s.id !== student.id);
      } else {
        return [...prev, student];
      }
    });
  };

  const handleRemoveStudent = (studentId: string) => {
    setSelectedStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  const handleClearAll = () => {
    setSelectedStudents([]);
  };

  const handleSave = () => {
    if (onSelect) {
      onSelect(selectedStudents.map((s) => s.id));
    }
    setOpen(false);
  };

  // Filter students based on search query
  const filteredStudents = students.filter((student) => {
    const fullName = getStudentName(student).toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const filteredSelectedStudents = selectedStudents.filter((student) => {
    const fullName = getStudentName(student).toLowerCase();
    return fullName.includes(selectedSearchQuery.toLowerCase());
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='bg-background flex h-[85vh] min-w-6xl flex-col overflow-hidden rounded-xl border p-0 shadow-2xl'>
        <DialogHeader className='border-b px-6 pt-6 pb-4'>
          <DialogTitle className='flex items-center gap-2 text-xl font-bold'>
            <Users className='text-primary h-5 w-5' />
            Select Students
          </DialogTitle>
          <DialogDescription>
            Choose a classroom to load students, then select the students you want to assign to this action.
          </DialogDescription>
        </DialogHeader>

        {/* Main Content Grid */}
        <div className='grid min-h-0 flex-1 grid-cols-1 divide-y overflow-hidden md:grid-cols-2 md:divide-x md:divide-y-0'>
          {/* Section 1: Selection Panel */}
          <div className='flex min-h-0 flex-col space-y-4 overflow-hidden p-6'>
            <div>
              <Label htmlFor='classroom-select' className='mb-2 block text-sm font-semibold'>
                Classroom
              </Label>
              <Select
                value={selectedClassroomId || undefined}
                onValueChange={(val) => {
                  setSelectedClassroomId(val);
                  setSearchQuery('');
                }}
              >
                <SelectTrigger id='classroom-select' className='w-full'>
                  <SelectValue placeholder='Select a classroom' />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingClassrooms ? (
                    <div className='flex items-center justify-center p-4'>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Loading classrooms...
                    </div>
                  ) : (
                    classrooms.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedClassroomId && (
              <div className='relative'>
                <Search className='text-muted-foreground absolute top-2.5 left-3 h-4 w-4' />
                <Input
                  placeholder='Search students in classroom...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-9'
                />
              </div>
            )}

            <div className='min-h-0 flex-1 overflow-y-auto pr-1'>
              {!selectedClassroomId ? (
                <div className='text-muted-foreground flex h-full flex-col items-center justify-center p-6 text-center'>
                  <div className='bg-muted mb-4 rounded-full p-4'>
                    <Users className='text-muted-foreground h-8 w-8 opacity-60' />
                  </div>
                  <h4 className='mb-1 text-sm font-semibold'>No classroom selected</h4>
                  <p className='max-w-xs text-xs'>
                    Please select a classroom from the dropdown above to view and select students.
                  </p>
                </div>
              ) : isLoadingStudents ? (
                <div className='text-muted-foreground flex h-full flex-col items-center justify-center p-6 text-center'>
                  <Loader2 className='text-primary mb-4 h-8 w-8 animate-spin' />
                  <p className='text-sm'>Loading classroom students...</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className='text-muted-foreground flex h-full flex-col items-center justify-center p-6 text-center'>
                  <h4 className='mb-1 text-sm font-semibold'>No students found</h4>
                  <p className='max-w-xs text-xs'>
                    {searchQuery ? 'Try adjusting your search query.' : 'There are no students in this classroom.'}
                  </p>
                </div>
              ) : (
                <div className='space-y-2'>
                  {filteredStudents.map((student) => {
                    const isSelected = selectedStudents.some((s) => s.id === student.id);
                    return (
                      <div
                        key={student.id}
                        onClick={() => handleToggleStudent(student)}
                        className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all duration-200 ${
                          isSelected
                            ? 'border-primary bg-primary/5 hover:bg-primary/10 shadow-sm'
                            : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <div className='flex items-center gap-3'>
                          <Avatar className='h-9 w-9 border'>
                            <AvatarImage src={student.avatar?.url || ''} alt={getStudentName(student)} />
                            <AvatarFallback className='bg-primary/10 text-primary text-xs font-semibold'>
                              {getInitials(student)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className='text-sm leading-none font-medium'>{getStudentName(student)}</p>
                            {student.gender && (
                              <span className='text-muted-foreground mt-1 inline-block text-[10px] capitalize'>
                                {student.gender.toLowerCase()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                            isSelected
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'border-muted-foreground/30'
                          }`}
                        >
                          {isSelected && <Check className='h-3 w-3 stroke-3' />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Selected Panel */}
          <div className='bg-muted/20 flex min-h-0 flex-col space-y-4 overflow-hidden p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Label className='text-sm font-semibold'>Selected Students</Label>
                <Badge variant='secondary' className='rounded-full font-semibold'>
                  {selectedStudents.length}
                </Badge>
              </div>
              {selectedStudents.length > 0 && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleClearAll}
                  className='text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-8 text-xs'
                >
                  Clear all
                </Button>
              )}
            </div>

            {selectedStudents.length > 0 && (
              <div className='relative'>
                <Search className='text-muted-foreground absolute top-2.5 left-3 h-4 w-4' />
                <Input
                  placeholder='Search selected students...'
                  value={selectedSearchQuery}
                  onChange={(e) => setSelectedSearchQuery(e.target.value)}
                  className='pl-9'
                />
              </div>
            )}

            <div className='min-h-0 flex-1 overflow-y-auto pr-1'>
              {selectedStudents.length === 0 ? (
                <div className='text-muted-foreground flex h-full flex-col items-center justify-center p-6 text-center'>
                  <div className='bg-muted mb-4 rounded-full p-4'>
                    <Users className='text-muted-foreground h-8 w-8 opacity-40' />
                  </div>
                  <h4 className='mb-1 text-sm font-semibold'>No students selected</h4>
                  <p className='max-w-xs text-xs'>
                    Selected students will appear here for easy review before confirming.
                  </p>
                </div>
              ) : filteredSelectedStudents.length === 0 ? (
                <div className='text-muted-foreground flex h-full flex-col items-center justify-center p-6 text-center'>
                  <h4 className='mb-1 text-sm font-semibold'>No matching students</h4>
                  <p className='text-xs'>Adjust your search query to find selected students.</p>
                </div>
              ) : (
                <div className='grid grid-cols-1 gap-2'>
                  {filteredSelectedStudents.map((student) => (
                    <Card key={student.id} className='border-border/60 hover:border-border transition-all'>
                      <CardContent className='flex items-center justify-between p-3'>
                        <div className='flex items-center gap-3'>
                          <Avatar className='h-8 w-8 border'>
                            <AvatarImage src={student.avatar?.url || ''} alt={getStudentName(student)} />
                            <AvatarFallback className='bg-primary/10 text-primary text-[10px] font-semibold'>
                              {getInitials(student)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className='text-xs leading-none font-semibold'>{getStudentName(student)}</p>
                            <span className='text-muted-foreground mt-0.5 inline-block text-[9px]'>
                              {`${student.firstName.ar} ${student.lastName.ar}`}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleRemoveStudent(student.id)}
                          className='text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 w-7 rounded-full'
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={selectedStudents.length === 0} className='sm:ml-2'>
            Confirm Selection ({selectedStudents.length})
          </Button>
        </>
      </DialogContent>
    </Dialog>
  );
};

export default SelectStudents;
