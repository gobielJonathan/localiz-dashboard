import { NextRequest } from 'next/server';

import { PostgrestSingleResponse } from '@supabase/supabase-js';

import { supabase } from '@/function/db';
import createResponse from '@/lib/create-response';
import { handleInvitationSchema } from '@/schema/invitation';

export async function GET(req: NextRequest) {
  const handleInvitationSchemaParsed = handleInvitationSchema.safeParse({
    code: req.nextUrl.searchParams.get('code'),
    status: req.nextUrl.searchParams.get('status'),
  });

  if (!handleInvitationSchemaParsed.success) {
    return createResponse({
      type: 'failed',
      status: 500,
      error: handleInvitationSchemaParsed.error.formErrors.fieldErrors,
    });
  }

  const { code, status } = handleInvitationSchemaParsed.data;

  let response: PostgrestSingleResponse<any> | undefined = undefined;

  if (status === 'accept') {
    response = await supabase
      .from('invitations')
      .update({
        is_accept: true,
      })
      .eq('code', code)
      .is('is_accept', null)
      .select('dashboard_id, invitation_to');

    if (response.data) {
      await supabase.from('team').insert({
        dashboard_id: response.data[0]?.dashboard_id,
        user_id: response.data[0]?.invitation_to,
      });
    }
  }

  if (status === 'decline') {
    response = await supabase
      .from('invitations')
      .update({
        is_accept: false,
      })
      .eq('code', code)
      .is('is_accept', null)
      .select('dashboard_id, invitation_to');
  }

  if (response?.error) {
    return createResponse({
      type: 'failed',
      status: response.status,
      error: response.error.message,
    });
  }

  return createResponse({
    type: 'success',
    payload: response?.data,
    status: 200,
  });
}
