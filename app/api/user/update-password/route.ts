import { NextRequest } from 'next/server';

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

  await supabase.auth.setSession({
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

  return createResponse({
    type: 'success',
    status: 200,
    payload: 'Successfully updated password',
  });
}
