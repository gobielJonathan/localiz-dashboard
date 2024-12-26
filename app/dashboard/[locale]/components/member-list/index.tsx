'use client';

import { useForm } from '@tanstack/react-form';
import { PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { z } from 'zod';

import useGetTeams from '@/app/dashboard/hooks/use-get-teams';
import { AutoComplete } from '@/components/ui/autocomplete';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
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
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import fetcher from '@/lib/fetch';
import { FormError } from '@/model/form';
import { asyncTryCatch } from '@/utils/try-catch';

export default function MemberList({ dashboardId }: { dashboardId: number }) {
  const { data: teams } = useGetTeams(dashboardId);

  const form = useForm({
    defaultValues: {
      note: '',
      invitation_to: '',
    },

    validators: {
      onChange: z.object({
        note: z.string({ message: 'note is required' }),
        invitation_to: z.string({ message: 'invitation_to is required' }),
      }),
      onSubmitAsync: async ({ value }) => {
        console.log({ value });
        const [error] = await asyncTryCatch(() =>
          fetcher('/api/invitation/generate', {
            method: 'POST',
            body: JSON.stringify({ dashboard_id: dashboardId, ...value }),
          }),
        );

        if (error instanceof FormError) {
          return { fields: error.fieldError };
        }

        if (error) {
          toast.error(error.message, { position: 'top-right' });
          return;
        }

        toast.success('Invitation sent successfully', {
          position: 'top-right',
        });

        return null;
      },
    },
  });

  const onSearchMember = async (text: string) => {
    const [error, response] = await asyncTryCatch(() =>
      fetcher(`/api/auth/suggestion?text=${text}`),
    );
    if (error) return [];

    return response.data.map((user: { user_id: string; email: string }) => ({
      value: user.user_id,
      label: user.email,
    }));
  };

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
            <form
              onSubmit={(e) => {
                e.stopPropagation();
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <div className="grid gap-4 py-4">
                <form.Field
                  name="invitation_to"
                  children={(field) => (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor={field.name} className="text-right">
                        Email
                      </Label>
                      <AutoComplete
                        textFieldProps={{
                          id: field.name,
                          name: field.name,
                          placeholder: 'member@example.com',
                          className: 'col-span-3',
                        }}
                        onFetch={onSearchMember}
                        onChoose={(userId) => {
                          field.handleChange(userId);
                        }}
                      />
                    </div>
                  )}
                />

                <form.Field
                  name="note"
                  children={(field) => (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor={field.name} className="text-right">
                        Note
                      </Label>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Type a note to the member (optional)"
                        className="col-span-3"
                      />
                    </div>
                  )}
                />
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
