import { UserRole } from '@repo/contracts/types/enums/enums';
import {
  Calendar,
  CalendarDays,
  Clipboard,
  DoorClosed,
  GraduationCap,
  ListCheck,
  Newspaper,
  NotebookPen,
  Paperclip,
  ScrollText,
  SquareUserRound,
  UserCogIcon,
  UsersRound,
} from 'lucide-react';

export type NavRoute = {
  title: string;
  url: string;
  icon: React.ElementType;
  isActive: boolean;
  items?: (Omit<NavRoute, 'items' | 'icon'> & { roles: UserRole[] })[];
  roles: UserRole[];
};

const navRoutes: NavRoute[] = [
  // {
  //   title: 'Dashboard',
  //   url: '/dashboard',
  //   icon: LayoutDashboard,
  //   isActive: true,
  //   items: [
  //     {
  //       title: 'Overview',
  //       url: '/dashboard/overview',
  //       isActive: true,
  //       roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  //     },
  //     {
  //       title: 'Stats',
  //       url: '/dashboard/stats',
  //       isActive: false,
  //       roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  //     },
  //   ],
  //   roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  // },
  {
    title: 'Staff',
    url: '/staff',
    icon: UserCogIcon,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  {
    title: 'Teachers',
    url: '/teachers',
    icon: SquareUserRound,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  {
    title: 'Parents',
    url: '/parents',
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
    title: 'Assignments',
    url: '/assignments',
    icon: Clipboard,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  {
    title: 'Timetable',
    url: '/timetable',
    icon: CalendarDays,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER, UserRole.TEACHER],
  },
  {
    title: 'Exams',
    url: '/exams',
    icon: ScrollText,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER, UserRole.TEACHER],
  },
  {
    title: 'Attendance',
    url: '/attendances',
    icon: ListCheck,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  {
    title: 'Extracurriculars',
    url: '/extracurriculars',
    icon: ListCheck,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  {
    title: 'Teacher Comments',
    url: '/teacher-comments',
    icon: Paperclip,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  {
    title: 'Homeworks',
    url: '/homeworks',
    icon: NotebookPen,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  {
    title: 'Calendar',
    url: '/calendar',
    icon: Calendar,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER, UserRole.TEACHER],
  },
  {
    title: 'Feed',
    url: '/feed',
    icon: Newspaper,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  // {
  //   title: 'Settings',
  //   url: '/settings',
  //   icon: Settings2,
  //   isActive: true,
  //   items: [
  //     {
  //       title: 'Profile',
  //       url: '/settings/profile',
  //       isActive: true,
  //       roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  //     },
  //   ],
  //   roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  // },
];

export default navRoutes;
