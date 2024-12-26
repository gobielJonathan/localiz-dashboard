import { cookies } from 'next/headers';

import { addSeconds } from 'date-fns';

import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/storage/auth';
import { supabase } from '@/function/db';
import createResponse from '@/lib/create-response';
import decrypt from '@/lib/decrypt';
import { tryCatch } from '@/lib/try-catch';
import { loginSchema } from '@/schema/auth';

export async function POST(req: Request) {
  const body = await req.json();
  const resultParsed = loginSchema.safeParse(body);

  if (!resultParsed.success) {
    return createResponse({
      type: 'failed',
      status: 500,
      error: resultParsed.error.formErrors.fieldErrors,
    });
  }

  const { email, password: encryptedPassword } = resultParsed.data;

  //try to decrypt the password first
  const [errorDecryptPassword, password] = tryCatch(() =>
    decrypt(encryptedPassword),
  );
  if (errorDecryptPassword) {
    return createResponse({
      type: 'failed',
      status: 500,
      error: errorDecryptPassword.message,
    });
  }

  if (!password) return;

  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (authError) {
    return createResponse({
      type: 'failed',
      status: 401,
      error: authError.message,
    });
  }

  const { access_token, refresh_token, expires_in } = data.session;
  const { id: user_id, email: user_email } = data.user;

  const cookieStore = await cookies();

  const expires = addSeconds(new Date(), expires_in);

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
    payload: {
      id: user_id,
      email: user_email,
    },
    status: 200,
  });
}
