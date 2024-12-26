'use client';

import Link from 'next/link';

import { Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import useGetNotification from '../hooks/use-get-notification';

export function Notification() {
  const { data: notifications } = useGetNotification();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {notifications.length}
            </span>
          )}
          <span className="sr-only">View notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px]">
        {notifications.map((notification) => (
          <DropdownMenuItem
            key={notification.id}
            className="flex flex-col items-start gap-1 p-4"
          >
            <div className="font-medium">{notification.title}</div>
            <div className="text-sm text-muted-foreground">
              {notification.description}
            </div>
            <div className="text-xs text-muted-foreground/60">
              {notification.time}
            </div>

            {notification.actions && (
              <div className="inline-flex space-x-4 ml-auto">
                {notification.actions.map((action, idx) => (
                  <Link key={idx} target="_blank" href={action.url}>
                    <span
                      className={cn({
                        'bg-primary text-white p-2': action.type === 'primary',
                      })}
                    >
                      {action.text}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </DropdownMenuItem>
        ))}
        {notifications.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No new notifications
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
