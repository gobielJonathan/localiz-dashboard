'use client';

import { ReactNode } from 'react';

import Link from 'next/link';

import { ChevronRight, type LucideIcon } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

interface Props {
  items: {
    title: string;
    icon?: LucideIcon;
    isActive?: boolean;
    suffix?: ReactNode;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}
export function NavMain({ items }: Props) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
          Platform
        </h2>
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span className="font-bold">{item.title}</span>
                  <div className="ml-auto inline-flex items-center">
                    {item.suffix}
                    <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 h-4 w-4" />
                  </div>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
