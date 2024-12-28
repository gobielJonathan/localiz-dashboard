import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/storage/auth';
import { supabase } from '@/function/db';
import createResponse from '@/lib/create-response';
import { updateUserSchema } from '@/schema/auth';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();

  const body = await req.json();
  const resultParsed = updateUserSchema.safeParse(body);

  if (!resultParsed.success) {
    return createResponse({
      type: 'failed',
      status: 500,
      error: resultParsed.error.formErrors.fieldErrors,
    });
  }

  const { email, name } = resultParsed.data;

  const user = await supabase.auth.getUser(
    cookieStore.get(ACCESS_TOKEN)?.value,
  );
  if (user.error) {
    return createResponse({
      type: 'failed',
      status: 500,
      error: user.error.message,
    });
  }

  const hasEmailChange = user.data.user.email !== email;
  if (hasEmailChange) {
    const emailResponse = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();
    if (emailResponse.error) {
      return createResponse({
        type: 'failed',
        status: 500,
        error: emailResponse.error.message,
      });
    }
    if (emailResponse) {
      return createResponse({
        type: 'failed',
        status: 500,
        error: 'Email already exist',
      });
    }
  }

  await supabase.auth.setSession({
    access_token: cookieStore.get(ACCESS_TOKEN)?.value ?? '',
    refresh_token: cookieStore.get(REFRESH_TOKEN)?.value ?? '',
  });

  const updatedUser = await supabase.auth.updateUser({
    data: { email, name },
    email,
  });
  if (updatedUser.error) {
    return createResponse({
      type: 'failed',
      status: 500,
      error: updatedUser.error.message,
    });
  }

  return createResponse({
    status: 200,
    type: 'success',
    payload: {
      email,
      name,
    },
  });
}
