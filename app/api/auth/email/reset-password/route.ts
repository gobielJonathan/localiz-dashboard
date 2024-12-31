import { NextRequest } from 'next/server';

import { supabase } from '@/function/db';
import createResponse from '@/lib/create-response';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const userResponse = await supabase
    .from('users')
    .select('id')
    .eq('email', body.email);

  if (userResponse.error) {
    return createResponse({
      status: userResponse.status,
      error: userResponse.error.message,
      type: 'failed',
    });
  }

  if (userResponse.data.length === 0) {
    return createResponse({
      status: 404,
      error: 'Email not found',
      type: 'failed',
    });
  }

  const resetPassword = await supabase.auth.resetPasswordForEmail(body.email, {
    redirectTo: 'https://localhost:3000/update-password',
  });

  if (resetPassword.error) {
    return createResponse({
      type: 'failed',
      status: 500,
      error: resetPassword.error.message,
    });
  }

  return createResponse({
    type: 'success',
    status: 200,
    payload: resetPassword.data,
  });
}
