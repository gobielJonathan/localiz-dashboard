import { cookies } from 'next/headers';

import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/storage/auth';
import createResponse from '@/function/create-response';
import { supabase } from '@/function/db';
import { loginSchema } from '@/schema/auth';
import decrypt from '@/utils/decrypt';
import { tryCatch } from '@/utils/try-catch';

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

  const { access_token, refresh_token, expires_at } = data.session;
  const { id: user_id, email: user_email } = data.user;

  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN, data.session.access_token, { httpOnly: true });
  cookieStore.set(REFRESH_TOKEN, data.session.refresh_token, {
    httpOnly: true,
  });

  return createResponse({
    type: 'success',
    payload: {
      id: user_id,
      email: user_email,
      access_token,
      refresh_token,
      expires_at,
    },
    status: 200,
  });
}
