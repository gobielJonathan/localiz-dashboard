import { cookies } from 'next/headers';

import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/storage/auth';
import { supabase } from '@/function/db';

import Client from './page.client';

export default async function Page() {
  const cookieStore = await cookies();

  await supabase.auth.setSession({
    access_token: cookieStore.get(ACCESS_TOKEN)?.value ?? '',
    refresh_token: cookieStore.get(REFRESH_TOKEN)?.value ?? '',
  });

  const user = await supabase.auth.getUser();
  if (user.error) {
    throw new Error(user.error.message);
  }

  return (
    <Client
      email={user.data.user.email ?? ''}
      name={user.data.user.user_metadata.name ?? ''}
    />
  );
}
