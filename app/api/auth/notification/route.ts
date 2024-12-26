import { differenceInMinutes } from 'date-fns';

import { supabase } from '@/function/db';
import createResponse from '@/lib/create-response';
import { NotificationValue } from '@/model/notification';
import getAuthUser from '@/repository/auth/get-auth-user';

export async function GET() {
  const user = await getAuthUser();

  let notifications: NotificationValue[] = [];

  const invitationResponse = await supabase
    .from('invitations')
    .select('created_at, note, code, dashboard ( name ) ')
    .eq('invitation_to', user.user.id)
    .is('is_accept', null);

  if (!invitationResponse.error) {
    const invitationNotifications =
      invitationResponse.data.map<NotificationValue>((invitation) => {
        return {
          id: invitation.code,
          description: `You have been invited to join ${invitation.dashboard?.name} dashboard, with notes: ${invitation.note}`,
          title: 'Team member invited',
          time:
            differenceInMinutes(new Date(), new Date(invitation.created_at)) +
            ' minutes ago',

          actions: [
            {
              text: 'Accept',
              url: `/api/invitation/handle?code=${invitation.code}&status=accept`,
            },
            {
              text: 'Decline',
              url: `/api/invitation/handle?code=${invitation.code}&status=decline`,
            },
          ],
        };
      });

    notifications.push(...invitationNotifications);
  }

  return createResponse({
    type: 'success',
    payload: notifications,
    status: 200,
  });
}
