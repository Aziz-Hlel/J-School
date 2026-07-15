import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useGetCurrentProfile, useGetUserCurrentRole } from '@/store/useAuthStore';
import { UserRole } from '@repo/contracts/types/enums/enums';
import { ArrowRightLeft, GalleryVerticalEnd, ShieldUser, UserCog, UserStar } from 'lucide-react';
import { Button } from '../ui/button';
import ChangeCurrentProfile from './changeCurrentProfile';

export interface INavbarHeader {
  name: string;
  logo: React.ElementType;
  plan: string;
}

const roleLogoMapper: Record<UserRole, React.ElementType> = {
  [UserRole.DIRECTOR]: UserStar,
  [UserRole.MANAGER]: UserCog,
  [UserRole.TEACHER]: ShieldUser,
  [UserRole.PARENT]: ShieldUser,
};

export function NavBarHeader() {
  const currentProfile = useGetCurrentProfile();
  const currentRole = useGetUserCurrentRole();

  if (!currentProfile) {
    return null;
  }

  const UserLogo = currentRole ? roleLogoMapper[currentRole] : GalleryVerticalEnd;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
        >
          <ChangeCurrentProfile>
            <Button variant='ghost' className='group/nav-item mx-0 flex px-0'>
              <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                <UserLogo className='block size-4 group-hover/nav-item:hidden' />
                <ArrowRightLeft className='dark:text-foreground hidden size-4 group-hover/nav-item:block' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{currentProfile.firstName + ' ' + currentProfile.lastName}</span>
                <span className='truncate text-xs'>{currentProfile.school?.names.fr}</span>
              </div>
            </Button>
          </ChangeCurrentProfile>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
