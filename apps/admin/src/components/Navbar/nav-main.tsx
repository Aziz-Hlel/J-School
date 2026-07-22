import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import navRoutes, { type NavRoute } from '@/data/sidebar/sidebarRoutes';
import { useAuthStore } from '@/store/useAuthStore';
import type { Prettify } from '@repo/contracts/utils/Prettify';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

export function NavMain() {
  const currentUserRole = useAuthStore((state) => state.currentRole);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {navRoutes.map((navRoute, index) => {
          if (
            currentUserRole &&
            navRoute.roles.includes(currentUserRole) &&
            navRoute.items &&
            navRoute.items.length > 0
          )
            return <NestedRoute route={navRoute as INestedRoute} key={index} />;
          if (
            currentUserRole &&
            navRoute.roles.includes(currentUserRole) &&
            (!navRoute.items || navRoute.items.length === 0)
          )
            return <SimpleRoute route={navRoute} key={index} />;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

type INestedRoute = Prettify<
  Omit<NavRoute, 'items'> & {
    items: Omit<NavRoute, 'items' | 'icon'>[];
  }
>;
const NestedRoute = ({ route }: { route: INestedRoute }) => {
  const { isMobile, state } = useSidebar();
  const { t } = useTranslation(['sidebar', 'common']);

  if (state === 'expanded')
    return (
      <Collapsible key={route.title} asChild defaultOpen={route.isActive} className='group/collapsible group'>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <route.icon />
              <span>{route.title}</span>
              <ChevronRight className='ml-auto transition-transform duration-200 group-open:rotate-90 group-data-[state=open]/collapsible:rotate-90' />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              {route.items?.map((subItem, subIndex) => (
                <SidebarMenuSubItem key={subIndex}>
                  <SidebarMenuSubButton asChild aria-disabled={!subItem.isActive}>
                    <Link to={subItem.url}>
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );

  return (
    <DropdownMenu key={route.title}>
      <SidebarMenuItem>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton tooltip={route.title}>
            <route.icon />
            <span>{t(`sidebar:routes.${route.title}`)}</span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side={isMobile ? 'bottom' : 'right'}
          align={isMobile ? 'end' : 'start'}
          className='min-w-56 rounded-lg'
        >
          {route.items?.map((item, itemIndex) => (
            <DropdownMenuItem asChild key={itemIndex} disabled={!item.isActive}>
              <Link to={item.url}>{item.title}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </SidebarMenuItem>
    </DropdownMenu>
  );
};

type ISimpleRoute = Omit<NavRoute, 'items'>;

const SimpleRoute = ({ route }: { route: ISimpleRoute }) => {
  const { t } = useTranslation(['sidebar', 'common']);
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        aria-disabled={!route.isActive}
        asChild
        className='cursor-pointer'
        tooltip={t(`sidebar:routes.${route.title}`)}
      >
        <Link to={route.url} className='flex items-center gap-2'>
          <route.icon />
          <span>{t(`sidebar:routes.${route.title}`)}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
