'use client';

import { useSearchParams } from 'next/navigation';

import { BookOpen, Settings2, SquareTerminal } from 'lucide-react';

import { NavMain } from '@/app/dashboard/components/nav-main';
import { NavUser } from '@/app/dashboard/components/nav-user';
import { TeamSwitcher } from '@/app/dashboard/components/team-switcher';
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

const generateNavMainProps = ({
  locales,
}: {
  locales: { title: string; url: string }[];
}) => [
  {
    title: 'Locales',
    url: '#',
    icon: SquareTerminal,
    items: locales,
  },
  {
    title: 'Documentation',
    url: '#',
    icon: BookOpen,
    items: [
      {
        title: 'Introduction',
        url: '#',
      },
      {
        title: 'Get Started',
        url: '#',
      },
      {
        title: 'Tutorials',
        url: '#',
      },
      {
        title: 'Changelog',
        url: '#',
      },
    ],
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings2,
    items: [
      {
        title: 'Team',
        url: '#',
      },
    ],
  },
];

interface Props {
  user: User;
  dashboard: Dashboard[];
}

export function AppSidebar(props: Props) {
  const searchParams = useSearchParams();
  const dashboardId = searchParams.get('id') ?? props.dashboard[0]?.id;

  const { data: locales } = useGetLocale(Number(dashboardId));

  const generateLocaleLink = (locale: string) => {
    return `/dashboard/${locale}?${searchParams.toString()}`;
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher teams={props.dashboard} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={generateNavMainProps({
            locales: locales.map((locale) => ({
              title: locale.locale,
              url: generateLocaleLink(locale.id.toString()),
            })),
          })}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
