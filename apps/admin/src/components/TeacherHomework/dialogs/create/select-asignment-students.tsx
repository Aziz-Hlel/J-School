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
import type { TeacherAssignmentRes } from '@repo/contracts/schemas/teacher/teacherAssignmentRes';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, CalendarDays, Check, ChevronRight, Loader2, Plus, Search, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

type InputType = {
  due: string;
  assignmentId: string;
  studentIds: string[];
};

interface SelectAsignmentStudentsProps {
  initValue?: InputType[];
  onChange: (data: InputType[]) => void;
  children: React.ReactNode;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

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

const getAssignmentLabel = (assignment: TeacherAssignmentRes) => {
  const subjectEn = assignment.subject.name.en ?? '';
  const subjectAr = assignment.subject.name.ar ?? '';
  const grade = assignment.classroom.grade;
  const classroom = assignment.classroom.name;
  return { subjectEn, subjectAr, grade, classroom };
};

// ─── Component ──────────────────────────────────────────────────────────────

const SelectAsignmentStudents = ({ onChange, children, initValue }: SelectAsignmentStudentsProps) => {
  const schoolId = useCurrentSchoolId();
  const currentProfile = useGetCurrentProfile();
  const [open, setOpen] = useState(false);

  // All teacher assignments (each = subject + classroom combo)
  const { data: allAssignmentsData, isLoading: isLoadingAssignments } = useQuery({
    queryKey: ['teachers', currentProfile?.id, 'assignments'],
    queryFn: async () => teacherService.assignments(schoolId, currentProfile!.id),
  });

  const allAssignments = allAssignmentsData?.data ?? [];

  // Global state: list of confirmed assignment entries
  const [data, setData] = useState<InputType[]>(initValue ?? []);

  // ── Left-panel transient state ──────────────────────────────────────────
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [selectedDue, setSelectedDue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [localSelectedStudents, setLocalSelectedStudents] = useState<StudentResponse[]>([]);

  const selectedAssignment = allAssignments.find((a) => a.id === selectedAssignmentId) ?? null;

  // Fetch students for the classroom of the selected assignment
  const classroomId = selectedAssignment?.classroom.id ?? null;

  const { data: studentsData, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['classrooms', classroomId, 'students'],
    queryFn: async () => classroomsService.getStudents({ schoolId, classroomId: classroomId! }),
    enabled: !!classroomId,
  });

  const displayedStudents = studentsData?.data ?? [];

  const filteredStudents = displayedStudents.filter((s) =>
    getStudentName(s).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Already-added assignment ids
  const addedAssignmentIds = new Set(data.map((d) => d.assignmentId));

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSelectAssignment = (id: string) => {
    setSelectedAssignmentId(id);
    setSearchQuery('');
    setLocalSelectedStudents([]);
    // Pre-fill if already in data
    const existing = data.find((d) => d.assignmentId === id);
    setSelectedDue(existing?.due ?? '');
  };

  const handleToggleStudent = (student: StudentResponse) => {
    setLocalSelectedStudents((prev) => {
      const exists = prev.some((s) => s.id === student.id);
      return exists ? prev.filter((s) => s.id !== student.id) : [...prev, student];
    });
  };

  const handleAddAssignment = () => {
    if (!selectedAssignmentId || !selectedDue || localSelectedStudents.length === 0) return;
    setData((prev) => {
      const exists = prev.some((d) => d.assignmentId === selectedAssignmentId);
      const entry: InputType = {
        assignmentId: selectedAssignmentId,
        due: selectedDue,
        studentIds: localSelectedStudents.map((s) => s.id),
      };
      return exists ? prev.map((d) => (d.assignmentId === selectedAssignmentId ? entry : d)) : [...prev, entry];
    });
    // Reset left panel
    setSelectedAssignmentId(null);
    setSelectedDue('');
    setLocalSelectedStudents([]);
    setSearchQuery('');
  };

  const handleRemoveEntry = (assignmentId: string) => {
    setData((prev) => prev.filter((d) => d.assignmentId !== assignmentId));
  };

  const handleConfirm = () => {
    onChange(data);
    setOpen(false);
  };

  const canAdd = !!selectedAssignmentId && !!selectedDue && localSelectedStudents.length > 0;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='bg-background flex h-[85vh] min-w-6xl flex-col overflow-hidden rounded-xl border p-0 shadow-2xl'>
        {/* Header */}
        <DialogHeader className='border-b px-6 pt-6 pb-4'>
          <DialogTitle className='flex items-center gap-2 text-xl font-bold'>
            <BookOpen className='text-primary h-5 w-5' />
            Select Assignments &amp; Students
          </DialogTitle>
          <DialogDescription>
            Choose an assignment, pick students from that classroom, set a due date — then add it. Repeat for multiple
            assignments.
          </DialogDescription>
        </DialogHeader>

        {/* Main content: 2 columns */}
        <div className='grid min-h-0 flex-1 grid-cols-1 divide-y overflow-hidden md:grid-cols-2 md:divide-x md:divide-y-0'>
          {/* ── LEFT: Assignment picker + Students ── */}
          <div className='flex min-h-0 flex-col space-y-4 overflow-hidden p-6'>
            {/* Assignment select */}
            <div>
              <Label htmlFor='assignment-select' className='mb-2 block text-sm font-semibold'>
                Assignment
              </Label>
              <Select value={selectedAssignmentId ?? undefined} onValueChange={handleSelectAssignment}>
                <SelectTrigger id='assignment-select' className='w-full'>
                  <SelectValue placeholder='Select an assignment…' />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingAssignments ? (
                    <div className='flex items-center justify-center p-4'>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Loading assignments…
                    </div>
                  ) : allAssignments.length === 0 ? (
                    <div className='text-muted-foreground p-4 text-center text-sm'>No assignments found.</div>
                  ) : (
                    allAssignments.map((a) => {
                      const { subjectEn, subjectAr, grade, classroom } = getAssignmentLabel(a);
                      return (
                        <SelectItem key={a.id} value={a.id}>
                          <span className='flex flex-col'>
                            <span className='font-medium'>
                              {subjectEn}
                              {subjectAr ? ` / ${subjectAr}` : ''}
                            </span>
                            <span className='text-muted-foreground text-xs'>
                              Grade {grade} · {classroom}
                            </span>
                          </span>
                        </SelectItem>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Selected assignment details chip */}
            {selectedAssignment && (
              <div className='bg-primary/5 border-primary/20 flex items-center gap-3 rounded-lg border px-3 py-2'>
                <BookOpen className='text-primary h-4 w-4 shrink-0' />
                <div className='min-w-0 flex-1'>
                  <p className='text-sm leading-tight font-semibold'>
                    {selectedAssignment.subject.name.en}
                    {selectedAssignment.subject.name.ar ? ` / ${selectedAssignment.subject.name.ar}` : ''}
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    Grade {selectedAssignment.classroom.grade} · {selectedAssignment.classroom.name}
                  </p>
                </div>
                {addedAssignmentIds.has(selectedAssignment.id) && (
                  <Badge variant='secondary' className='shrink-0 text-xs'>
                    Editing
                  </Badge>
                )}
              </div>
            )}

            {/* Due date (only when assignment chosen) */}
            {selectedAssignmentId && (
              <div>
                <Label htmlFor='due-date' className='mb-2 flex items-center gap-1.5 text-sm font-semibold'>
                  <CalendarDays className='h-3.5 w-3.5' />
                  Due Date
                </Label>
                <Input
                  id='due-date'
                  type='date'
                  value={selectedDue}
                  onChange={(e) => setSelectedDue(e.target.value)}
                  className='w-full'
                />
              </div>
            )}

            {/* Student search */}
            {selectedAssignmentId && (
              <div className='relative'>
                <Search className='text-muted-foreground absolute top-2.5 left-3 h-4 w-4' />
                <Input
                  placeholder='Search students…'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-9'
                />
              </div>
            )}

            {/* Student list */}
            <div className='min-h-0 flex-1 overflow-y-auto pr-1'>
              {!selectedAssignmentId ? (
                <div className='text-muted-foreground flex h-full flex-col items-center justify-center p-6 text-center'>
                  <div className='bg-muted mb-4 rounded-full p-4'>
                    <BookOpen className='text-muted-foreground h-8 w-8 opacity-60' />
                  </div>
                  <h4 className='mb-1 text-sm font-semibold'>No assignment selected</h4>
                  <p className='max-w-xs text-xs'>Select an assignment above to load its classroom students.</p>
                </div>
              ) : isLoadingStudents ? (
                <div className='text-muted-foreground flex h-full flex-col items-center justify-center p-6 text-center'>
                  <Loader2 className='text-primary mb-4 h-8 w-8 animate-spin' />
                  <p className='text-sm'>Loading students…</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className='text-muted-foreground flex h-full flex-col items-center justify-center p-6 text-center'>
                  <h4 className='mb-1 text-sm font-semibold'>No students found</h4>
                  <p className='max-w-xs text-xs'>
                    {searchQuery ? 'Try adjusting your search.' : 'There are no students in this classroom.'}
                  </p>
                </div>
              ) : (
                <div className='space-y-2'>
                  {filteredStudents.map((student) => {
                    const isSelected = localSelectedStudents.some((s) => s.id === student.id);
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

            {/* Add button */}
            {selectedAssignmentId && (
              <Button onClick={handleAddAssignment} disabled={!canAdd} className='w-full gap-2'>
                <Plus className='h-4 w-4' />
                {addedAssignmentIds.has(selectedAssignmentId) ? 'Update Assignment' : 'Add Assignment'}
                {localSelectedStudents.length > 0 && ` (${localSelectedStudents.length} students)`}
              </Button>
            )}
          </div>

          {/* ── RIGHT: Confirmed assignments list ── */}
          <div className='bg-muted/20 flex min-h-0 flex-col space-y-4 overflow-hidden p-6'>
            <div className='flex items-center gap-2'>
              <Label className='text-sm font-semibold'>Configured Assignments</Label>
              <Badge variant='secondary' className='rounded-full font-semibold'>
                {data.length}
              </Badge>
            </div>

            <div className='min-h-0 flex-1 overflow-y-auto pr-1'>
              {data.length === 0 ? (
                <div className='text-muted-foreground flex h-full flex-col items-center justify-center p-6 text-center'>
                  <div className='bg-muted mb-4 rounded-full p-4'>
                    <Users className='text-muted-foreground h-8 w-8 opacity-40' />
                  </div>
                  <h4 className='mb-1 text-sm font-semibold'>No assignments added yet</h4>
                  <p className='max-w-xs text-xs'>
                    Configure an assignment on the left and click "Add Assignment" to see it here.
                  </p>
                </div>
              ) : (
                <div className='space-y-3'>
                  {data.map((entry) => {
                    const assignment = allAssignments.find((a) => a.id === entry.assignmentId);
                    if (!assignment) return null;
                    const { subjectEn, subjectAr, grade, classroom } = getAssignmentLabel(assignment);
                    return (
                      <Card
                        key={entry.assignmentId}
                        className='border-border/60 hover:border-border cursor-pointer transition-all'
                        onClick={() => handleSelectAssignment(entry.assignmentId)}
                      >
                        <CardContent className='p-4'>
                          <div className='flex items-start justify-between gap-2'>
                            <div className='min-w-0 flex-1'>
                              {/* Subject */}
                              <div className='mb-1 flex items-center gap-1.5'>
                                <BookOpen className='text-primary h-3.5 w-3.5 shrink-0' />
                                <p className='truncate text-sm font-semibold'>
                                  {subjectEn}
                                  {subjectAr ? ` / ${subjectAr}` : ''}
                                </p>
                              </div>
                              {/* Grade + classroom */}
                              <p className='text-muted-foreground mb-2 text-xs'>
                                Grade {grade} · {classroom}
                              </p>
                              {/* Due + students row */}
                              <div className='flex flex-wrap items-center gap-2'>
                                <Badge variant='outline' className='gap-1 text-xs font-normal'>
                                  <CalendarDays className='h-3 w-3' />
                                  {entry.due}
                                </Badge>
                                <Badge variant='secondary' className='gap-1 text-xs font-normal'>
                                  <Users className='h-3 w-3' />
                                  {entry.studentIds.length} student{entry.studentIds.length !== 1 ? 's' : ''}
                                </Badge>
                              </div>
                            </div>
                            <div className='flex shrink-0 items-center gap-1'>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='text-muted-foreground hover:text-primary h-7 w-7 rounded-full'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectAssignment(entry.assignmentId);
                                }}
                              >
                                <ChevronRight className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 w-7 rounded-full'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveEntry(entry.assignmentId);
                                }}
                              >
                                <Trash2 className='h-4 w-4' />
                                <span className='sr-only'>Remove</span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between gap-3 border-t px-6 py-4'>
          <div className='text-muted-foreground text-sm'>
            {data.length > 0
              ? `${data.length} assignment${data.length !== 1 ? 's' : ''} · ${data.reduce((acc, d) => acc + d.studentIds.length, 0)} total student slot${data.reduce((acc, d) => acc + d.studentIds.length, 0) !== 1 ? 's' : ''}`
              : 'No assignments configured yet.'}
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={data.length === 0}>
              Confirm ({data.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectAsignmentStudents;
