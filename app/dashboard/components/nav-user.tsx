import { redirect, useRouter } from 'next/navigation';

import { ChevronsUpDown, LogOut, Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { asyncTryCatch } from '@/lib/try-catch';

import getInitials from '../utils/get-initial';

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
  };
}) {
  const router = useRouter();

  const { isMobile } = useSidebar();

  const onLogout = async () => {
    const [error, response] = await asyncTryCatch(() =>
      fetch('/api/auth/logout', {
        credentials: 'include',
        method: 'POST',
      }).then((res) => res.json()),
    );

    if (error) {
      toast(error.message);
      return;
    }

    if (response.status !== 200) {
      toast(response.message);
      return;
    }
    redirect('/login');
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {getInitials(user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem onClick={() => router.push('/setting')}>
              <Settings />
              Settings
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
