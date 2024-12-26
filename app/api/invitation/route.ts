import { NextRequest } from 'next/server';

import { supabase } from '@/function/db';
import createResponse from '@/lib/create-response';
import getAuthUser from '@/repository/auth/get-auth-user';

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  const invitationResponse = await supabase
    .from('invitations')
    .select('note, code, dashboard ( name ) ')
    .eq('invitation_to', user.user.id)
    .is('is_accept', null);

  if (invitationResponse.error) {
    return createResponse({
      type: 'failed',
      error: invitationResponse.error.message,
      status: 500,
    });
  }

  return createResponse({
    type: 'success',
    payload: invitationResponse.data,
    status: 200,
  });
}
