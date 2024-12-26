'use client';

import { PropsWithChildren, useCallback } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppSidebar } from '@/app/dashboard/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import UserProvider from '@/provider/user';

import AddNewLocaleForm from '../components/forms/add-new-locale';
import { Notification } from '../components/notification';

const queryClient = new QueryClient();

interface User {
  name: string;
  email: string;
}

interface Dashboard {
  id: number;
  name: string;
}

interface Props {
  dashboard: Dashboard[];
  user: User;
}

export default function DashboardLayout({
  dashboard,
  user,
  children,
}: PropsWithChildren<Props>) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isShowModalAddLocale = searchParams.get('modal') === 'add_locale';

  const closeModalAddLocale = useCallback(
    (open: boolean) => {
      if (open) return;

      const urlSearchParams = new URLSearchParams(searchParams.toString());
      urlSearchParams.delete('modal');
      router.replace(`${pathname}?${urlSearchParams.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const onSuccessAddLocale = useCallback(() => {
    closeModalAddLocale(false);
    router.refresh();
  }, [router, closeModalAddLocale]);

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider defaultDashboardId={dashboard[0]?.id} userId={user.email}>
        <SidebarProvider>
          <AppSidebar dashboard={dashboard} user={user} />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/dashboard">
                        Building Your Dashboard
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Localization List</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="ml-auto mr-4">
                <Notification />
              </div>
            </header>
            {children}

            <Dialog
              open={isShowModalAddLocale}
              onOpenChange={closeModalAddLocale}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Locale</DialogTitle>
                  <DialogDescription>
                    Enter the name of the new locale you want to add.
                  </DialogDescription>
                </DialogHeader>
                <AddNewLocaleForm
                  defaultDashboardId={dashboard[0]?.id}
                  onSucess={onSuccessAddLocale}
                />
              </DialogContent>
            </Dialog>
          </SidebarInset>
        </SidebarProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
