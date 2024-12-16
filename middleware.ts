// middleware.ts
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { supabase } from './function/db';

export async function middleware(req: NextRequest) {
  const cookiesStore = await cookies();

  const refresh_token = cookiesStore.get('refresh_token')?.value ?? '';
  const access_token = cookiesStore.get('access_token')?.value ?? '';
  // Validate the token using Supabase
  const { data: user, error } = await supabase.auth.setSession({
    refresh_token: refresh_token,
    access_token: access_token,
  });

  // If token is invalid, redirect to the login page
  if (error || !user) {
    return NextResponse.redirect(new URL('/login', req.url), { status: 301 });
  }

  // Allow the request to continue if valid
  return NextResponse.next();
}

// Configure the middleware matcher
export const config = {
  matcher: [
    /**
     * @note api section
     */
    '/api/dashboard/:path*',
    '/api/invitation/:path*',
    '/api/locale/:path*',
    '/api/team/:path*',
    '/api/user/:path*',

    /**
     * @note page section
     */
    '/dashboard/:path*',
  ],
};
