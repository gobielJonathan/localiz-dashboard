import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { addSeconds } from 'date-fns';

import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/storage/auth';
import { supabase } from '@/function/db';
import createResponse from '@/lib/create-response';
import decrypt from '@/lib/decrypt';
import { updatePasswordSchema } from '@/schema/auth';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const resultParsed = updatePasswordSchema.safeParse(body);

  if (!resultParsed.success) {
    return createResponse({
      type: 'failed',
      status: 500,
      error: resultParsed.error.formErrors,
    });
  }

  const { access_token, password, refresh_token } = resultParsed.data;

  const { data: session } = await supabase.auth.setSession({
    access_token: access_token,
    refresh_token: refresh_token,
  });

  const decryptedPassword = decrypt(password);
  const updatedPassword = await supabase.auth.updateUser({
    password: decryptedPassword,
  });

  if (updatedPassword.error) {
    return createResponse({
      type: 'failed',
      status: 500,
      error: updatedPassword.error.message,
    });
  }

  const { expires_in } = session.session ?? {};

  const cookieStore = await cookies();

  const expires = addSeconds(new Date(), expires_in ?? 3600);

  cookieStore.set(ACCESS_TOKEN, access_token, {
    httpOnly: true,
    expires: expires,
    secure: true,
  });
  cookieStore.set(REFRESH_TOKEN, refresh_token, {
    httpOnly: true,
    expires: expires,
    secure: true,
  });

  return createResponse({
    type: 'success',
    status: 200,
    payload: 'Successfully updated password',
  });
}
