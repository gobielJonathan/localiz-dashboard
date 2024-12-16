import { cookies } from 'next/headers';

import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/storage/auth';
import createResponse from '@/function/create-response';
import { supabase } from '@/function/db';

export async function POST() {
  const logoutResponse = await supabase.auth.signOut();

  if (logoutResponse.error) {
    return createResponse({
      type: 'failed',
      error: logoutResponse.error.message,
      status: 500,
    });
  }
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN);
  cookieStore.delete(REFRESH_TOKEN);

  return createResponse({
    type: 'success',
    payload: 'successfully logout',
    status: 200,
  });
}
