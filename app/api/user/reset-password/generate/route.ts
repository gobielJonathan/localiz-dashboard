import { NextRequest } from 'next/server';

import { supabase } from '@/function/db';
import createResponse from '@/lib/create-response';

export async function POST(req: NextRequest) {
  const body = await req.json();

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
