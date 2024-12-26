'use client';

import { useMemo } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { BookOpen, Globe, Plus, Settings2, SquareTerminal } from 'lucide-react';

import { NavMain } from '@/app/dashboard/components/nav-main';
import { NavUser } from '@/app/dashboard/components/nav-user';
import { TeamSwitcher } from '@/app/dashboard/components/team-switcher';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

import useGetLocale from '../hooks/use-get-locale';

interface User {
  name: string;
  email: string;
}

interface Dashboard {
  name: string;
  id: number;
}

interface Props {
  user: User;
  dashboard: Dashboard[];
}

export function AppSidebar(props: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dashboardId = searchParams.get('id') ?? props.dashboard[0]?.id;

  const { data: locales } = useGetLocale(Number(dashboardId));

  const generateLocaleLink = (locale: string) => {
    return `/dashboard/${locale}?${searchParams.toString()}`;
  };

  const navItems = [
    {
      title: 'Locales',
      url: '#',
      icon: Globe,
      items: locales.map((locale) => ({
        title: locale.locale,
        url: generateLocaleLink(locale.id.toString()),
      })),
      isActive: true,
      suffix: (
        <div
          className="w-6"
          onClick={(e) => {
            e.stopPropagation();
            const url = new URL(window.location.href);
            url.searchParams.set('modal', 'add_locale');
            router.replace(url.toString());
          }}
        >
          <Plus className="h-4 w-4" />
        </div>
      ),
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Team',
          url: '/dashboard/teams',
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher teams={props.dashboard} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
