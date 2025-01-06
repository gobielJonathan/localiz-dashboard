import { NextRequest } from 'next/server';

import { supabase } from '@/function/db';
import createResponse from '@/lib/create-response';

function generateOTP() {
  return Math.random().toString(36).slice(2).slice(6);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data, error } = await supabase.auth.signInWithOtp({
    email: body.email,
    options: { captchaToken: generateOTP() },
  });

  if (error) {
    return createResponse({
      status: error.status ?? 500,
      error: error.message,
      type: 'failed',
    });
  }

  return createResponse({
    status: 200,
    payload: data,
    type: 'success',
  });
}
