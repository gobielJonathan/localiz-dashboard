import { supabase } from '@/function/db';
import createResponse from '@/lib/create-response';
import getAuthUser from '@/repository/auth/get-auth-user';
import { asyncTryCatch } from '@/utils/try-catch';

export async function GET() {
  const [error, user] = await asyncTryCatch(() => getAuthUser());

  if (error) {
    return createResponse({
      type: 'failed',
      error: error.message,
      status: 500,
    });
  }

  const teamResponse = await supabase
    .from('team')
    .select('id, dashboard ( id , name )')
    .eq('user_id', user.user.id || '')
    .not('dashboard', 'is', null);

  if (teamResponse.error) {
    return createResponse({
      type: 'failed',
      error: teamResponse.error.message,
      status: teamResponse.status,
    });
  }

  return createResponse({
    type: 'success',
    payload: teamResponse.data,
    status: 200,
  });
}

export function POST() {
  return Response.json({
    data: [],
  });
}
