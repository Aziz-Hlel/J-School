import { AppSidebar } from '@/components/Navbar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Outlet } from 'react-router';

const Sidebar = ({ dir }: { dir: 'rtl' | 'ltr' }) => {
  return (
    <div className='fixed inset-0 flex h-screen overflow-y-hidden'>
      <TooltipProvider>
        <SidebarProvider dir={dir} defaultOpen={false}>
          <AppSidebar dir={dir} side={dir === 'rtl' ? 'right' : 'left'} />

          <SidebarInset>
            {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-black aspect-video rounded-xl" />
            <div className="bg-black aspect-video rounded-xl" />
            <div className="bg-black aspect-video rounded-xl" />
            </div>
            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
            </div> */}
            <main className='max-h-screen w-full overflow-y-auto'>
              <Outlet />
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
};

export default Sidebar;
