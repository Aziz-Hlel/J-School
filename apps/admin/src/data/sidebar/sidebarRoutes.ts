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
    title: 'staff',
    url: '/staff',
    icon: UserCogIcon,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  {
    title: 'teachers',
    url: '/teachers',
    icon: SquareUserRound,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  {
    title: 'parents',
    url: '/parents',
    icon: UsersRound,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  {
    title: 'students',
    url: '/students',
    icon: GraduationCap,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  {
    title: 'classrooms',
    url: '/classrooms',
    icon: DoorClosed,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  {
    title: 'assignments',
    url: '/assignments',
    icon: Clipboard,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER],
  },
  {
    title: 'timetable',
    url: '/timetable',
    icon: CalendarDays,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER, UserRole.TEACHER],
  },
  {
    title: 'exams',
    url: '/exams',
    icon: ScrollText,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER, UserRole.TEACHER],
  },
  {
    title: 'attendance',
    url: '/attendances',
    icon: ListCheck,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER, UserRole.TEACHER],
  },
  {
    title: 'extracurriculars',
    url: '/extracurriculars',
    icon: ListCheck,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER, UserRole.TEACHER],
  },
  {
    title: 'teacher_comments',
    url: '/teacher-comments',
    icon: Paperclip,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER, UserRole.TEACHER],
  },
  {
    title: 'homeworks',
    url: '/homeworks',
    icon: NotebookPen,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER, UserRole.TEACHER],
  },
  {
    title: 'calendar',
    url: '/calendar',
    icon: Calendar,
    isActive: true,
    roles: [UserRole.DIRECTOR, UserRole.MANAGER, UserRole.TEACHER],
  },
  {
    title: 'feed',
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
