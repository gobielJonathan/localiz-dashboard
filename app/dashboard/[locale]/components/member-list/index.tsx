'use client';

import { PlusCircle } from 'lucide-react';

import useGetTeams from '@/app/dashboard/hooks/use-get-teams';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function MemberList({ dashboardId }: { dashboardId: number }) {
  const { data: teams } = useGetTeams(dashboardId);

  const visibleTeamMembers = teams.slice(0, 3);
  const additionalMembersCount = Math.max(0, teams.length - 3);

  return (
    <>
      <h2 className="text-xl font-semibold mb-2 mt-6">Team Members</h2>
      <div className="flex items-center space-x-2">
        {visibleTeamMembers.map((member) => (
          <Avatar key={member.id}>
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${member.name}`}
            />
          </Avatar>
        ))}
        {additionalMembersCount > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-full w-10 h-10 p-0">
                +{additionalMembersCount}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60">
              <div className="space-y-2">
                {teams.slice(3).map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${member.name}`}
                      />
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.users.email}</div>
                      <div className="text-sm text-muted-foreground">
                        {member.users.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="rounded-full w-10 h-10 p-0">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Invite a new member to join this dashboard team.
              </DialogDescription>
            </DialogHeader>
            <form>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="member@example.com"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Send Invitation</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
