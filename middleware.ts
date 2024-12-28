// middleware.ts
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import arcjet, { createMiddleware, detectBot, fixedWindow } from '@arcjet/next';

import { supabase } from './function/db';

const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  characteristics: ['userId'],
  rules: [
    fixedWindow({
      mode: 'LIVE', // will block requests. Use "DRY_RUN" to log only
      window: '60s', // 60 second fixed window
      max: 100, // allow a maximum of 100 requests
    }),
    detectBot({ mode: 'LIVE', allow: [] }),
  ],
});

export default createMiddleware(aj);

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
    return NextResponse.redirect(
      new URL('/login?cb=' + req.nextUrl.href, req.url),
      { status: 301 },
    );
  }

  if (req.nextUrl.pathname.startsWith('/api')) {
    console.log('checking');
    const decision = await aj.protect(req, {
      userId: user.user?.id ?? '',
      requested: 5,
    }); // Deduct 5 tokens from the bucket

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: 'Too Many Requests', reason: decision.reason },
        { status: 429 },
      );
    }
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
    '/setting',
  ],
};
