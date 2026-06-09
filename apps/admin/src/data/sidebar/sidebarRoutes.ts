import { UserRole } from '@repo/contracts/types/enums/enums';
import { BellRing, DoorClosed, GraduationCap, LayoutDashboard, Package, Settings2, UsersRound } from 'lucide-react';

export type NavRoute = {
  title: string;
  url: string;
  icon: React.ElementType;
  isActive: boolean;
  items?: (Omit<NavRoute, 'items' | 'icon'> & { roles: UserRole[] })[];
  roles: UserRole[];
};

const navRoutes: NavRoute[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: 'Overview',
        url: '/dashboard/overview',
        isActive: true,
        roles: [UserRole.DIRECTOR, UserRole.MANAGER],
      },
      {
        title: 'Stats',
        url: '/dashboard/stats',
        isActive: false,
        roles: [UserRole.DIRECTOR, UserRole.MANAGER],
      },
    ],
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  {
    title: 'Staff',
    url: '/staff',
    icon: UsersRound,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  {
    title: 'Students',
    url: '/students',
    icon: GraduationCap,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  {
    title: 'Classrooms',
    url: '/classrooms',
    icon: DoorClosed,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  {
    title: 'Products',
    url: '/products',
    icon: Package,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  {
    title: 'Notification',
    url: '/notification',
    icon: BellRing,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  {
    title: 'Products2',
    url: '/products2',
    icon: Package,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings2,
    isActive: true,
    items: [
      {
        title: 'Profile',
        url: '/settings/profile',
        isActive: true,
        roles: [UserRole.DIRECTOR, UserRole.MANAGER],
      },
    ],
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
];

export default navRoutes;
