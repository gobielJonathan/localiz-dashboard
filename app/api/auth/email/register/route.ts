import { supabase } from '@/function/db';
import createResponse from '@/lib/create-response';
import decrypt from '@/lib/decrypt';
import { tryCatch } from '@/lib/try-catch';
import { registerSchema } from '@/schema/auth';

export async function POST(req: Request) {
  const body = await req.json();
  const resultParsed = registerSchema.safeParse(body);

  if (!resultParsed.success) {
    return createResponse({
      type: 'failed',
      status: 500,
      error: resultParsed.error.formErrors.fieldErrors,
    });
  }

  const { email, password: encryptedPassword, phone, name } = resultParsed.data;

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

  const { data, error: registerError } = await supabase.auth.signUp({
    email: email,
    password: password,
    phone: phone,
    options: {
      emailRedirectTo: '/api/auth/callback',
      data: { name: name },
    },
  });

  if (registerError) {
    return createResponse({
      type: 'failed',
      status: 500,
      error: registerError.message,
    });
  }

  await supabase.from('users').insert({
    user_id: data.user?.id ?? '',
    email: email,
    data: JSON.stringify({
      email: email,
      phone: phone,
      name: name,
    }),
  });

  return createResponse({
    type: 'success',
    payload: {
      email: data.user?.email,
      phone: data.user?.phone,
    },
    status: 200,
  });
}
