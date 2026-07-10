import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUser } from '@/context/UserContext';
import { useAuthStore } from '@/store/useAuthStore';
import type { AdministrationWorkspace, TeacherWorkspace } from '@repo/contracts/schemas/auth/authResponse';
import { UserRole } from '@repo/contracts/types/enums/enums';
import { useEffect, useState } from 'react';

type ProfileType = {
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId: string;
  schoolName: string;
  original: AdministrationWorkspace | TeacherWorkspace;
};

const ChangeCurrentProfile = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const [open, setOpen] = useState(false);
  const currentProfile = useAuthStore((state) => state.currentProfile);

  const [profiles, setProfiles] = useState<ProfileType[]>([]);

  useEffect(() => {
    const newProfiles: ProfileType[] = [];
    user.administration.forEach((administration) => {
      if (!administration.school) return;
      newProfiles.push({
        firstName: administration.firstName,
        lastName: administration.lastName,
        role: administration.role === 'OWNER' ? UserRole.DIRECTOR : administration.role,
        schoolId: administration.school.id,
        schoolName: administration.school.names.fr,
        original: administration,
      });
    });

    user.teacher?.forEach((teacher) => {
      if (!teacher.school) return;
      newProfiles.push({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        role: UserRole.TEACHER,
        schoolId: teacher.school.id,
        schoolName: teacher.school.names.fr,
        original: teacher,
      });
    });
    setProfiles(newProfiles);
  }, [user]);

  const handleProfileClick = (profile: ProfileType) => {
    useAuthStore.setState({
      currentProfile: profile.original,
      currentRole: profile.role,
      schoolId: profile.schoolId,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[calc(100vh-2rem)] gap-0 overflow-hidden p-0 sm:max-w-3xl'>
        <DialogHeader className='border-b px-6 py-5 pr-12'>
          <DialogTitle>Change Profile</DialogTitle>
        </DialogHeader>
        <div className='flex-1 overflow-y-auto p-6'>
          <div className='grid gap-4'>
            {profiles.map((profile) => (
              <div
                key={`${profile.schoolId}-${profile.role}`}
                className='hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors'
              >
                <div>
                  <div className='text-sm font-medium'>
                    {profile.firstName} {profile.lastName} ({profile.schoolName})
                  </div>
                  <div className='text-muted-foreground text-xs'>
                    {profile.role} {profile.role !== 'DIRECTOR' && `at ${profile.schoolName}`}
                  </div>
                </div>
                <Button variant='ghost' size='sm' onClick={() => handleProfileClick(profile)}>
                  Select
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeCurrentProfile;
