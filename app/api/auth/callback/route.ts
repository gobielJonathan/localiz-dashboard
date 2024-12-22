import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

import { addSeconds } from 'date-fns';

export async function GET(req: NextRequest) {
  const urlSearchParam = new URLSearchParams(`?${req.nextUrl.hash.slice(1)}`);

  const access_token = urlSearchParam.get('access_token') || '';
  const refresh_token = urlSearchParam.get('refresh_token') || '';
  const expires_in = Number(urlSearchParam.get('expires_in') || 1);

  const expires = addSeconds(new Date(), expires_in);

  const cookieStore = await cookies();
  cookieStore.set('access_token', access_token, {
    httpOnly: true,
    expires: expires,
    secure: true,
  });
  cookieStore.set('refresh_token', refresh_token, {
    httpOnly: true,
    expires: expires,
    secure: true,
  });

  return redirect('/');
}
