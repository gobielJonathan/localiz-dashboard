import { supabase } from '@/function/db';
import createResponse from '@/lib/create-response';
import getAuthUser from '@/repository/auth/get-auth-user';
import { invitationSchema } from '@/schema/invitation';

export async function POST(req: Request) {
  const body = await req.json();

  const invitationSchemaParsed = invitationSchema.safeParse(body);
  if (invitationSchemaParsed.error) {
    return createResponse({
      type: 'failed',
      error: invitationSchemaParsed.error.formErrors.fieldErrors,
      status: 500,
    });
  }

  const { dashboard_id, note, invitation_to } = invitationSchemaParsed.data;

  const loggedInUser = await getAuthUser();
  if (invitation_to === loggedInUser.user.id) {
    return createResponse({
      type: 'failed',
      error: 'You cannot invite yourself',
      status: 400,
    });
  }

  const inTeamResponse = await supabase
    .from('team')
    .select('id')
    .eq('dashboard_id', dashboard_id)
    .eq('user_id', invitation_to);
  if (inTeamResponse.data?.length == 1) {
    return createResponse({
      type: 'failed',
      error: 'User already in team',
      status: 400,
    });
  }

  const invitationResponse = await supabase
    .from('users')
    .select('id')
    .eq('user_id', invitation_to);

  if (invitationResponse.error) {
    return createResponse({
      type: 'failed',
      error: invitationResponse.error.message,
      status: 500,
    });
  }

  if (invitationResponse.data.length === 0) {
    return createResponse({
      type: 'failed',
      error: 'user not found',
      status: 404,
    });
  }

  const randomCode = Math.random().toString(36).slice(2);

  const user = await getAuthUser();

  const insertedInvitation = await supabase
    .from('invitations')
    .insert({
      code: randomCode,
      dashboard_id: dashboard_id,
      invitation_by: user.user.id,
      invitation_to: invitation_to,
      note: note,
    })
    .select('id, code')
    .single();

  if (insertedInvitation.error) {
    return createResponse({
      type: 'failed',
      status: insertedInvitation.status,
      error: insertedInvitation.error.message,
    });
  }

  return createResponse({
    type: 'success',
    status: 200,
    payload: insertedInvitation.data,
  });
}
