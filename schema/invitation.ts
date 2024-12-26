import { z } from 'zod';

export const invitationSchema = z.object({
  dashboard_id: z.number({ message: 'dashboard_id is required' }),
  note: z.string({ message: 'note is required' }),
  invitation_to: z.string({ message: 'invitation_to is required' }),
});

export const handleInvitationSchema = z.object({
  code: z.string({ message: 'code is required' }),
  status: z.enum(['accept', 'decline']),
});
